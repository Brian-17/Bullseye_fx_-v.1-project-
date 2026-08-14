/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet, type Route } from "@angular/router";
import { AuthMenuComponent } from "../../../features/authentication/menu/auth-menu/auth-menu";

interface NavItem {
	path: string;
	label: string;
}

/**
 * App-owned layout — overrides the base `app-layout` at compose (the app package
 * ships its own copy, so patches-cli's "app wins" rule selects this one over the
 * base-angular-app version). This is the Angular analogue of the React external
 * app's own `appLayout.tsx`: the layout belongs to the PROJECT, not the base app
 * or a feature. The auth feature's `AuthAppLayout` wrapper renders `<app-layout />`
 * (via its `__inherit__app-layout` stub), which resolves to this component.
 *
 * Adds two things over the base layout:
 *   - `<app-auth-menu />` in the header (the auth feature's account dropdown),
 *     the parallel of the React app rendering `<AuthMenu />`.
 *   - Dynamic navigation derived from the router config at runtime — the Angular
 *     analogue of React's `getAllRoutes()` reading route `handle` metadata. Post
 *     compose the router config IS the merged base + feature routes, so nav items
 *     surface automatically for any route whose `data.showInNavigation` is true.
 */
@Component({
	selector: "app-layout",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet, RouterLink, RouterLinkActive, AuthMenuComponent],
	templateUrl: "./app-layout.html",
})
export class AppLayoutComponent {
	private readonly router = inject(Router);

	readonly isOpen = signal(false);

	/**
	 * Flatten the router config and keep routes explicitly marked for navigation
	 * (`data.showInNavigation === true` with a `data.label`). Mirrors the React
	 * `getAllRoutes().filter(r => r.handle?.showInNavigation)` selection.
	 */
	readonly navigationItems = computed<NavItem[]>(() =>
		this.collectNavItems(this.router.config, ""),
	);

	private collectNavItems(routes: Route[], parentPath: string): NavItem[] {
		const items: NavItem[] = [];
		for (const route of routes) {
			const segment = route.path ?? "";
			const fullPath =
				segment === ""
					? parentPath || "/"
					: parentPath === "/" || parentPath === ""
						? `/${segment}`
						: `${parentPath}/${segment}`;

			const data = route.data as { showInNavigation?: boolean; label?: string } | undefined;
			if (data?.showInNavigation === true && data.label) {
				items.push({ path: fullPath, label: data.label });
			}

			if (route.children?.length) {
				items.push(...this.collectNavItems(route.children, fullPath));
			}
		}
		return items;
	}

	toggleMenu(): void {
		this.isOpen.update((v) => !v);
	}

	closeMenu(): void {
		this.isOpen.set(false);
	}
}
