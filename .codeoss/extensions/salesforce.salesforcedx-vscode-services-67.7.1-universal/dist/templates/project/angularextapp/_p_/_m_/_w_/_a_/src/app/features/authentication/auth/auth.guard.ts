/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { AUTH_REDIRECT_PARAM, ROUTES } from "../config/authentication.config";

/**
 * Route guard — the Angular analogue of the React `PrivateRoute` layout.
 *
 * Allows activation when the user is authenticated. Otherwise redirects to the
 * login page with a `startUrl` query param capturing the requested destination,
 * so the user is returned there after a successful login.
 *
 * Because `AuthService` runs its initial check on construction, the guard first
 * awaits any in-flight `loading` state (equivalent to the React guard returning
 * `null` while loading, then re-rendering once auth resolves). It resolves to a
 * boolean `true` or a `UrlTree` redirect — never leaves the user on a blank
 * screen.
 */
export const authGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
	const authService = inject(AuthService);
	const router = inject(Router);

	// Wait for the initial auth check to settle before deciding. If a check is
	// already resolved this returns immediately.
	if (authService.loading()) {
		await authService.checkAuth();
	} else if (authService.user() === null && authService.error() !== null) {
		// The prior check finished unauthenticated *because of an error* (e.g. a
		// transient network failure), not a confirmed guest. Without this, a single
		// failed initial check would poison protected-route access until a full page
		// reload. Re-run the check on guard entry so recovery doesn't require reload.
		await authService.checkAuth();
	}

	if (authService.isAuthenticated()) {
		return true;
	}

	// Capture the current destination (path + query) to return to after login.
	// `state.url` is already the resolved absolute URL for the attempted route.
	const destination = state.url;
	return router.createUrlTree([ROUTES.LOGIN.PATH], {
		queryParams: { [AUTH_REDIRECT_PARAM]: destination },
	});
};
