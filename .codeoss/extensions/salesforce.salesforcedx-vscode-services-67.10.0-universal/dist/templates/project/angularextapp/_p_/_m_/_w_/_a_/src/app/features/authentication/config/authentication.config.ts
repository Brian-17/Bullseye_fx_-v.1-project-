/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */

/**
 * Centralized configuration for Auth routes. Each route contains both the path
 * and page title. Using constants prevents typos in route paths across the app.
 *
 * Direct port of the React `authenticationConfig.ts`. NOTE: Angular route
 * `path` values are relative (no leading slash) in `app.routes.ts`; these
 * PATH constants keep the leading slash so `routerLink` / `navigate` calls and
 * the open-redirect validation behave exactly as the React version.
 */
export const ROUTES = {
	LOGIN: {
		PATH: "/login",
		TITLE: "Login | MyApp",
	},
	REGISTER: {
		PATH: "/register",
		TITLE: "Create Account | MyApp",
	},
	FORGOT_PASSWORD: {
		PATH: "/forgot-password",
		TITLE: "Recover Password | MyApp",
	},
	RESET_PASSWORD: {
		PATH: "/reset-password",
		TITLE: "Reset Password | MyApp",
	},
	PROFILE: {
		PATH: "/profile",
		TITLE: "My Profile | MyApp",
	},
	CHANGE_PASSWORD: {
		PATH: "/change-password",
		TITLE: "Change Password | MyApp",
	},
} as const;

/**
 * Centralized configuration for API endpoints. These are server-side endpoints,
 * not client-side routes.
 */
export const API_ROUTES = {
	// W-21253864: Logout URL integration is not currently supported
	LOGOUT: "/secur/logout.jsp",
	// Custom Apex REST resources handling the auth flows.
	LOGIN: "/services/apexrest/auth/login",
	REGISTER: "/services/apexrest/auth/register",
	FORGOT_PASSWORD: "/services/apexrest/auth/forgot-password",
	RESET_PASSWORD: "/services/apexrest/auth/reset-password",
	CHANGE_PASSWORD: "/services/apexrest/auth/change-password",
} as const;

/**
 * Query parameter key used to store the return URL.
 * e.g. /login?startUrl=/profile
 */
export const AUTH_REDIRECT_PARAM = "startUrl";

/** Placeholder text constants for authentication form inputs. */
export const AUTH_PLACEHOLDERS = {
	EMAIL: "e.g. name@example.com",
	PASSWORD: "Enter your password",
	PASSWORD_CREATE: "Create a password",
	PASSWORD_CONFIRM: "Re-enter your password",
	PASSWORD_NEW: "Enter new password",
	PASSWORD_NEW_CONFIRM: "Re-enter new password",
	FIRST_NAME: "e.g. Alex",
	LAST_NAME: "e.g. Smith",
	USERNAME: "e.g. asmith",
} as const;
