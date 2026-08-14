/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { computed, inject, Injectable, signal } from "@angular/core";
import { DataClient } from "../../../api/data-client.service";
import { API_ROUTES } from "../config/authentication.config";

/** The authenticated user shape (mirrors the React `AuthContext` `User`). */
export interface AuthUser {
	readonly id: string;
	readonly name: string;
}

// UI API version used for the Chatter current-user lookup. Mirrors the constant
// baked into @salesforce/ui-bundle's getCurrentUser helper.
const API_VERSION = "65.0";

/**
 * Angular signal-based replacement for the React `AuthProvider` / `useAuth`.
 *
 * `providedIn: 'root'` makes the service a single app-wide singleton, so it
 * replaces the React context+provider wrapper without any `<AuthProvider>` in
 * the tree (the coordinator-approved design). State is exposed as readonly
 * signals; `isAuthenticated` is a computed mirror of `user !== null`.
 *
 * Authentication is checked on construction (equivalent to the React mount
 * `useEffect`). `checkAuth()` re-runs the lookup on demand.
 *
 * The current-user lookup goes through the base app's `DataClient.fetch` to the
 * Chatter `/users/me` endpoint — the exact call `@salesforce/ui-bundle`'s
 * `getCurrentUser` makes — so the feature reuses the base app's existing
 * `@salesforce/platform-sdk` dependency and adds no new package.
 */
@Injectable({ providedIn: "root" })
export class AuthService {
	// DataClient is provided by the base-angular-app; consumed via the
	// `__inherit__` stub under app/api/ (patches-cli strips the prefix at compose
	// so it resolves to the seeded base data-client.service.ts).
	private readonly dataClient = inject(DataClient);

	private readonly _user = signal<AuthUser | null>(null);
	private readonly _loading = signal<boolean>(true);
	private readonly _error = signal<string | null>(null);

	/** The current authenticated user, or null when unauthenticated. */
	readonly user = this._user.asReadonly();
	/** True while the initial (or a manual) auth check is in flight. */
	readonly loading = this._loading.asReadonly();
	/** Error message from the most recent failed auth check, else null. */
	readonly error = this._error.asReadonly();
	/** Mirrors React `isAuthenticated = user !== null`. */
	readonly isAuthenticated = computed(() => this._user() !== null);

	constructor() {
		// Kick off the initial check on construction (React mount `useEffect`).
		void this.checkAuth();
	}

	/**
	 * Fetches the current user and updates state. Mirrors the React `checkAuth`.
	 */
	async checkAuth(): Promise<void> {
		this._loading.set(true);
		this._error.set(null);
		try {
			const userData = await this.getCurrentUser();
			this._user.set(userData);
		} catch (err) {
			console.error("Authentication failed", err);
			this._error.set("Authentication failed");
			this._user.set(null);
		} finally {
			this._loading.set(false);
		}
	}

	/**
	 * Returns the current user, throwing when unauthenticated. The Angular
	 * analogue of the React `useUser()` hook — used by the Profile page which
	 * only renders behind the auth guard.
	 */
	requireUser(): AuthUser {
		const user = this._user();
		if (!user) {
			throw new Error("Authenticated context not established");
		}
		return user;
	}

	/**
	 * Navigate to the server-side logout endpoint. Uses `replace` to prevent the
	 * back button from returning to an authenticated session. Direct port of the
	 * React `logout`.
	 */
	logout(startURL?: string): void {
		const finalLogoutUrl = startURL
			? `${API_ROUTES.LOGOUT}?startURL=${encodeURIComponent(startURL)}`
			: API_ROUTES.LOGOUT;
		window.location.replace(finalLogoutUrl);
	}

	/**
	 * Fetches the current user via the Chatter `/users/me` endpoint. Reproduces
	 * `@salesforce/ui-bundle`'s `getCurrentUser` so we don't add ui-bundle as a
	 * dependency (base app only ships @salesforce/platform-sdk).
	 */
	private async getCurrentUser(): Promise<AuthUser> {
		const response = await this.dataClient.fetch(
			`/services/data/v${API_VERSION}/chatter/users/me`,
			{
				method: "GET",
				headers: { Accept: "application/json" },
			},
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch current user: HTTP ${response.status}`);
		}
		const data = (await response.json()) as { id?: string; name?: string };
		if (!data?.id) {
			throw new Error("Current user response missing id");
		}
		return { id: data.id, name: data.name || "User" };
	}
}
