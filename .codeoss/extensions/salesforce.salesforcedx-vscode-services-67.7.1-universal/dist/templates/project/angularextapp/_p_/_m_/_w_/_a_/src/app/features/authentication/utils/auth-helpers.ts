/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { AUTH_REDIRECT_PARAM } from "../config/authentication.config";

/**
 * Extracts the startUrl from the current query params, defaulting to '/'.
 *
 * SECURITY NOTE: This function strictly validates the URL to prevent Open
 * Redirect vulnerabilities. It allows only relative paths.
 *
 * Direct port of the React `getStartUrl`. The React version takes a
 * `URLSearchParams`; Angular's `ParamMap` exposes the same `get(key)` contract,
 * so this accepts a minimal `{ get(name): string | null }` shape and works with
 * both an `ActivatedRoute` `ParamMap` and a `URLSearchParams`.
 *
 * @param params - The query-param map (e.g. ActivatedRoute.snapshot.queryParamMap).
 * @returns The start URL for post-authentication redirect.
 */
export function getStartUrl(params: { get(name: string): string | null }): string {
	const url = params.get(AUTH_REDIRECT_PARAM);
	if (url && isValidRedirect(url)) {
		return url;
	}
	return "/";
}

/**
 * Security: Validates that the redirect URL is a relative path to prevent Open
 * Redirect vulnerabilities.
 *
 * Security Checks:
 * 1. Rejects protocol-relative URLs (//)
 * 2. Rejects backslash usage which some browsers treat as slashes (/\)
 * 3. Rejects control characters
 *
 * Ported from the React `isValidRedirect`, with one intentional hardening: the
 * character-range ceiling is tightened from the React source's U+00FF to the
 * printable-ASCII bound U+007E (~) so DEL / C1 controls / NBSP are rejected in
 * line with check #3. Do not relax any of these checks without security review.
 */
export function isValidRedirect(url: string): boolean {
	// Basic structure check
	if (!url.startsWith("/") || url.startsWith("//")) return false;
	// Security: Reject backslashes to prevent /\example.com bypasses
	if (url.includes("\\")) return false;
	// Robustness: Ensure it doesn't contain whitespace/control characters.
	// Allowed range is the printable-ASCII band U+0021 (!) through U+007E (~).
	// This deliberately tightens the React reference's U+00FF ceiling, which
	// admitted U+007F (DEL), the C1 control block (U+0080-U+009F, incl. NEL),
	// and U+00A0 (NBSP) - all of which contradict the "reject control
	// characters" contract and are open-redirect / request-splitting vectors.
	if (/[^!-~]/.test(url)) return false;
	return true;
}

/**
 * Shared response type for authentication endpoints (login/register). Success
 * responses contain `success: true` and `redirectUrl`. Error responses contain
 * an `errors` array.
 */
export interface AuthResponse {
	success?: boolean;
	redirectUrl?: string | null;
	errors?: string[];
}
