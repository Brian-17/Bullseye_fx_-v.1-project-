"use strict";
/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTraceFlagsForCurrentUser = void 0;
const effect_ext_utils_1 = require("@salesforce/effect-ext-utils");
const Duration = require("effect/Duration");
const Effect = require("effect/Effect");
const vscode = require("vscode");
const extensionProvider_1 = require("./extensionProvider");
/** Promise bridge for imperative code. Ensures trace flags exist for the current target org user with the ReplayDebuggerLevels debug level. */
const ensureTraceFlagsForCurrentUser = () => Effect.runPromise(Effect.gen(function* () {
    const api = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi;
    const traceFlagService = yield* api.services.TraceFlagService;
    const userId = yield* traceFlagService.getUserId();
    const config = vscode.workspace.getConfiguration('salesforcedx-vscode-apex-log');
    const durationMinutes = config.get('traceFlagsDefaultDurationMinutes', 30);
    yield* traceFlagService.ensureTraceFlag(userId, Duration.minutes(durationMinutes));
    return true;
}).pipe(Effect.tapError(e => Effect.logError('ensureTraceFlagsForCurrentUser failed', e)), Effect.catchAll(() => Effect.succeed(false)), Effect.provide(extensionProvider_1.AllServicesLayer)));
exports.ensureTraceFlagsForCurrentUser = ensureTraceFlagsForCurrentUser;
//# sourceMappingURL=ensureTraceFlags.js.map