/**
 * Shared helpers for the org-setup scripts (W-23043735, spec §5.2/§5.6/Q9).
 *
 * Factored out of org-setup.mjs so BOTH `org-setup.mjs` and `org-setup-dev.mjs` import the
 * same primitives instead of duplicating them:
 *   - process runners (`run`, `runAsync`, `spawnAsync`)
 *   - SFDX path + UI-bundle discovery (`resolveSfdxSource`, `discoverAllUIBundleDirs`,
 *     `discoverUIBundleDir` — with the multi-bundle acknowledgment of §5.1 item 2)
 *   - the interactive `--target-org` fallback (`resolveTargetOrg`) and its
 *     single-select picker (`promptSelect`)
 *   - pure, unit-testable logic for the license gate, SOQL-name validation, org-list
 *     parsing, and the non-TTY multi-bundle warning
 *
 * IMPORTANT: this module is side-effect-free at import time — no top-level
 * readFileSync / process.exit / CLI run — so it can be imported by tests and by
 * org-setup-dev.mjs without triggering org-setup's main(). All I/O happens inside the
 * exported functions, only when they are called. Errors are plain `Error`s (not
 * org-setup's StepError) to avoid an import cycle; runStep handles both alike.
 */

import { spawnSync } from 'node:child_process';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Pure logic (no I/O) — unit-testable in isolation.
// ---------------------------------------------------------------------------

/**
 * Validate that a profile name is safe to interpolate into a SOQL `WHERE Name =
 * '<name>'` clause (spec §5.3, Q10 — validate-and-fail, NOT an escaper). The
 * `selfRegProfile` is developer-authored config the app ships, and license /
 * profile names are not expected to contain special characters, so a `'`, `\`,
 * or control char is treated as a config mistake to surface loudly rather than a
 * value to silently escape. Returns the name unchanged when valid; throws a
 * clear config error otherwise. AC-8.
 */
export function validateProfileNameForSoql(name) {
  const s = String(name);
  // SOQL string delimiter (') and escape char (\) would break/inject the query;
  // control chars (C0 + DEL) have no legitimate place in a profile name.
  if (/['\\]/.test(s) || /[\x00-\x1f\x7f]/.test(s)) {
    throw new Error(
      `selfRegProfile name "${name}" contains an unsupported character ` +
        `(quotes, backslashes, and control characters are not allowed). ` +
        `Fix the profile name in org-setup.config.json.`,
    );
  }
  return s;
}

/**
 * Decide whether the self-reg profile's UserLicense is satisfied, from the rows
 * a `SELECT UserLicense.LicenseDefinitionKey, UserLicense.Name, UserLicense.Status,
 * UserLicense.TotalLicenses, UserLicense.UsedLicenses FROM Profile WHERE Name = '…'`
 * query returns (spec §5.3). The seat math MUST be done here in JS — SOQL cannot
 * compare two fields (Q3, verified live). Matches/report on the stable
 * `LicenseDefinitionKey`, never the display Name (AC-2b).
 *
 * satisfied ⇔ Status === 'Active' && (total === -1 [unlimited sentinel] || total - used > 0).
 * 0 rows / null UserLicense ⇒ not satisfied, with a reason naming the profile.
 *
 * @returns {{ satisfied: boolean, reason: string|null, license: {key,label,status,total,used}|null }}
 */
export function evaluateLicenseRows(rows, profileName) {
  const lic = Array.isArray(rows) ? rows[0]?.UserLicense : null;
  if (!lic) {
    return {
      satisfied: false,
      reason: `no UserLicense found for profile "${profileName}" — the profile is missing in the org or its name is misspelled`,
      license: null,
    };
  }
  const key = lic.LicenseDefinitionKey ?? null;
  const label = lic.Name ?? key ?? 'unknown license';
  const total = Number(lic.TotalLicenses);
  const used = Number(lic.UsedLicenses);
  const license = { key, label, status: lic.Status, total, used };

  if (lic.Status !== 'Active') {
    return { satisfied: false, reason: `license ${label} (${key}) is not Active (Status=${lic.Status})`, license };
  }
  // Seat counts should always be integers in practice, but guard against a
  // missing/non-numeric field so the skip reason stays legible (not "NaN/NaN").
  if (!Number.isFinite(total) || !Number.isFinite(used)) {
    return { satisfied: false, reason: `could not read seat counts for license ${label} (${key})`, license };
  }
  // -1 is the documented "unlimited" sentinel (defensive — unverified live, §5.3).
  if (total === -1 || total - used > 0) {
    return { satisfied: true, reason: null, license };
  }
  return {
    satisfied: false,
    reason: `license ${label} (${key}) has no available seats (${used}/${total} used)`,
    license,
  };
}

/**
 * Parse `sf org list --json` defensively into a flat org list + the default org
 * (spec §5.1 item 3; mirrors isOrgConnected's try/catch tolerance). Collects
 * every array under `result` (nonScratchOrgs, scratchOrgs, sandboxes, devHubs, …)
 * so the picker sees all authenticated orgs; the default is the entry marked
 * `isDefaultUsername`. Malformed / unexpected JSON ⇒ empty result (caller then
 * falls back to the clear error).
 *
 * @returns {{ orgs: Array<{alias:string|null, username:string, isDefault:boolean}>, defaultOrg: string|null }}
 */
export function parseOrgList(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { orgs: [], defaultOrg: null };
  }
  const result = parsed?.result;
  if (!result || typeof result !== 'object') return { orgs: [], defaultOrg: null };

  const orgs = [];
  const seen = new Set();
  for (const val of Object.values(result)) {
    if (!Array.isArray(val)) continue;
    for (const entry of val) {
      if (!entry || typeof entry !== 'object' || !entry.username) continue;
      if (seen.has(entry.username)) continue;
      seen.add(entry.username);
      orgs.push({
        alias: entry.alias ?? null,
        username: entry.username,
        isDefault: entry.isDefaultUsername === true,
      });
    }
  }
  const def = orgs.find((o) => o.isDefault);
  return { orgs, defaultOrg: def ? (def.alias ?? def.username) : null };
}

/**
 * Multi-line warning for the non-TTY multi-bundle case (spec §5.1 item 2, AC-4b):
 * there is nothing to interactively acknowledge, so keep the deterministic
 * `all[0]` pick but never do it silently — name every bundle, the chosen one, and
 * the `--ui-bundle-name` remedy.
 */
export function buildMultiBundleWarning(allBundleNames, chosen) {
  return [
    `⚠ Multiple UI bundles found under uiBundles/ (${allBundleNames.length}):`,
    ...allBundleNames.map((n) => `    - ${n}${n === chosen ? '   ← using this one' : ''}`),
    `  Using "${chosen}" (first alphabetically). To deploy a different bundle, re-run with:`,
    `    --ui-bundle-name <name>`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Process runner (moved from org-setup.mjs; plain Error to avoid an import cycle).
// Only the synchronous `run` is shared — org-setup-dev.mjs runs its steps serially. The
// async spawn variants stay local to org-setup.mjs where the parallel permset
// path uses them, so this module exposes no caller-less surface.
// ---------------------------------------------------------------------------

export function run(name, cmd, args, opts = {}) {
  const { cwd = process.cwd(), optional = false } = opts;
  console.log('\n---', name, '---');
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    ...(opts.env && { env: opts.env }),
    ...(opts.timeout && { timeout: opts.timeout }),
  });
  if (result.status !== 0 && !optional) {
    throw new Error(`${name} (exit ${result.status ?? 1})`);
  }
  return result;
}

// ---------------------------------------------------------------------------
// SFDX paths + UI-bundle discovery.
// ---------------------------------------------------------------------------

/**
 * Resolve the first package directory's source root (main/default) from
 * sfdx-project.json under `root`. Exits non-zero with a clear message when the
 * project file or packageDirectories path is missing. Called explicitly by each
 * entry script (not at import) so this module stays side-effect-free.
 */
export function resolveSfdxSource(root) {
  const sfdxPath = resolve(root, 'sfdx-project.json');
  if (!existsSync(sfdxPath)) {
    console.error('Error: sfdx-project.json not found at project root.');
    process.exit(1);
  }
  const sfdxProject = JSON.parse(readFileSync(sfdxPath, 'utf8'));
  const pkgDir = sfdxProject?.packageDirectories?.[0]?.path;
  if (!pkgDir) {
    console.error('Error: No packageDirectories[].path found in sfdx-project.json.');
    process.exit(1);
  }
  return resolve(root, pkgDir, 'main', 'default');
}

/** Basename of a bundle dir path, cross-platform. */
function bundleName(dir) {
  return dir.split(/[/\\]/).pop();
}

/**
 * All UI bundle directories under `uiBundlesDir` (alphabetical, hidden dirs
 * excluded). When `uiBundleName` is given, returns just that one (erroring if it
 * doesn't exist). Exits non-zero when the uiBundles dir or a named bundle is
 * missing.
 */
export function discoverAllUIBundleDirs(uiBundlesDir, uiBundleName) {
  if (!existsSync(uiBundlesDir)) {
    console.error(`Error: uiBundles directory not found: ${uiBundlesDir}`);
    process.exit(1);
  }
  const entries = readdirSync(uiBundlesDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'));
  if (dirs.length === 0) {
    console.error(`Error: No UI bundle folder found under ${uiBundlesDir}`);
    process.exit(1);
  }
  if (uiBundleName) {
    const requested = dirs.find((d) => d.name === uiBundleName);
    if (!requested) {
      console.error(`Error: UI bundle directory not found: ${uiBundleName}`);
      process.exit(1);
    }
    return [resolve(uiBundlesDir, requested.name)];
  }
  return dirs.map((d) => resolve(uiBundlesDir, d.name));
}

/**
 * Resolve the single UI bundle to operate on, with the multi-bundle
 * acknowledgment of spec §5.1 item 2 (Q5). When >1 bundle exists and no
 * `--ui-bundle-name` was given:
 *   - TTY: present a single-select picker (all bundles, alphabetical all[0]
 *     preselected) — enter accepts all[0], arrows choose another (AC-4).
 *   - non-TTY: keep the deterministic all[0] pick but emit the multi-line warning
 *     (AC-4b) — never a silent pick.
 * Explicit `--ui-bundle-name` short-circuits both (no prompt, no warning; AC-4c).
 */
export async function discoverUIBundleDir(uiBundlesDir, uiBundleName) {
  const all = discoverAllUIBundleDirs(uiBundlesDir, uiBundleName);
  if (all.length > 1 && !uiBundleName) {
    const names = all.map(bundleName);
    if (process.stdin.isTTY) {
      const idx = await promptSelect(names, {
        prompt: 'Multiple UI bundles found — select which one to deploy:',
        preselectedIndex: 0,
      });
      return all[idx];
    }
    console.warn(buildMultiBundleWarning(names, names[0]));
  }
  return all[0];
}

// ---------------------------------------------------------------------------
// Interactive single-select picker + --target-org fallback.
// ---------------------------------------------------------------------------

/**
 * Interactive single-select: arrow keys navigate, enter confirms. Returns the
 * chosen index. Falls through to `preselectedIndex` immediately when stdin is not
 * a TTY. Built on the same raw-mode scaffolding as promptSteps (org-setup.mjs)
 * but selects exactly one item (spec §5.1 items 2 & 3).
 */
export function promptSelect(options, { prompt = 'Select an option:', preselectedIndex = 0 } = {}) {
  if (!process.stdin.isTTY || options.length === 0) return Promise.resolve(preselectedIndex);

  let cursor = Math.min(Math.max(0, preselectedIndex), options.length - 1);
  const RST = '\x1B[0m';
  const CYAN = '\x1B[36m';
  const GREEN = '\x1B[32m';

  function render() {
    return options.map((label, row) => {
      const ptr = row === cursor ? `${CYAN}❯${RST}` : ' ';
      const chk = row === cursor ? `${GREEN}●${RST}` : '○';
      return `${ptr} ${chk} ${label}`;
    });
  }

  return new Promise((resolvePromise) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdout.write('\x1B[?25l');
    console.log(`\n${prompt} (↑↓ move, enter confirm):\n`);
    let prevRows = options.length;
    process.stdout.write(render().join('\n') + '\n');

    function redraw() {
      process.stdout.write(`\x1B[${prevRows}A`);
      const lines = render();
      for (const line of lines) process.stdout.write(`\x1B[2K${line}\n`);
      prevRows = lines.length;
    }

    process.stdin.on('data', (key) => {
      if (key === '\x03') {
        process.stdout.write('\x1B[?25h\n');
        process.exit(0);
      }
      if (key === '\r' || key === '\n') {
        process.stdout.write('\x1B[?25h');
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeAllListeners('data');
        console.log();
        resolvePromise(cursor);
        return;
      }
      if (key === '\x1B[A' || key === 'k') {
        cursor = Math.max(0, cursor - 1);
        redraw();
      } else if (key === '\x1B[B' || key === 'j') {
        cursor = Math.min(options.length - 1, cursor + 1);
        redraw();
      }
    });
  });
}

/**
 * Resolve the target org (spec §5.1 item 3, §15). When `--target-org` is supplied
 * it is returned verbatim with NO `sf org list` call (AC-7, byte-for-byte the
 * scripted path). Otherwise discover authenticated orgs via `sf org list --json`
 * and:
 *   - TTY: present a picker with the default org at the top and preselected
 *     (AC-5); enter selects the default.
 *   - non-TTY: use the default org if resolvable, else exit 1 with a clear
 *     message (AC-6).
 */
export async function resolveTargetOrg(parsed) {
  if (parsed.targetOrg) return parsed.targetOrg;

  const listResult = spawnSync('sf', ['org', 'list', '--json'], {
    encoding: 'utf8',
    shell: true,
  });
  const { orgs, defaultOrg } = parseOrgList(listResult.status === 0 ? listResult.stdout : '');

  if (process.stdin.isTTY && orgs.length > 0) {
    // Default org first + preselected; the rest keep sf's order.
    const ordered = [...orgs].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
    const labels = ordered.map((o) => {
      const name = o.alias ?? o.username;
      const suffix = o.alias && o.alias !== o.username ? ` (${o.username})` : '';
      return `${name}${suffix}${o.isDefault ? '  [default]' : ''}`;
    });
    const idx = await promptSelect(labels, { prompt: 'Select the target org:', preselectedIndex: 0 });
    const chosen = ordered[idx];
    return chosen.alias ?? chosen.username;
  }

  if (defaultOrg) {
    console.log(`No --target-org given; using the default org: ${defaultOrg}`);
    return defaultOrg;
  }

  console.error(
    'Error: --target-org <alias> is required. No default org is set and this is not an ' +
      'interactive terminal. Set a default org (sf config set target-org=<alias>) or pass --target-org.',
  );
  process.exit(1);
}
