/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { SkeletonComponent } from "../../../../components/ui/skeleton/skeleton";
import { AuthService } from "../../auth/auth.service";
import { ROUTES } from "../../config/authentication.config";

/**
 * Auth menu — the Angular port of the React `AuthMenu`. A header dropdown that
 * shows the authenticated user's name + Edit Profile / Sign Out, or Log In /
 * Register for guests. While auth state is loading it shows a skeleton avatar.
 *
 * Owns its own trigger and `mat-menu` (the canonical Material menu shape): an
 * icon-only person button carries `matMenuTriggerFor`, so the trigger — with its
 * `aria-haspopup` / `aria-expanded` / keyboard handling — sits on a real focusable
 * `<button>`. Extra items can be inserted before Sign Out via `[menuItems]`
 * projection.
 *
 * Reads `AuthService` directly (the `providedIn: 'root'` replacement for
 * `useAuth`), so no inputs are needed for auth state.
 */
@Component({
	selector: "app-auth-menu",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, SkeletonComponent],
	templateUrl: "./auth-menu.html",
})
export class AuthMenuComponent {
	private readonly authService = inject(AuthService);

	protected readonly routes = ROUTES;
	protected readonly user = this.authService.user;
	protected readonly isAuthenticated = this.authService.isAuthenticated;
	protected readonly loading = this.authService.loading;

	protected onLogout(): void {
		this.authService.logout();
	}
}
