/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
// Base-app UI wrappers, inherited (not recreated) by this feature. Post-compose
// they land at uiBundles/<target>/src/app/components/ui/{button,input}/..., three levels
// up from this page folder (app/features/account-search/ -> app/components/ui/).
import { ButtonComponent } from "../../components/ui/button/button";
import { InputComponent } from "../../components/ui/input/input";

/**
 * Account-search landing page. Mirrors the React `Home` page: a single search
 * box plus a "Browse All Accounts" shortcut. Submitting navigates to the
 * `accounts` list, carrying the typed term as the `q` query param so the search
 * page's {@link ObjectSearchStateService} seeds the multi-field search filter.
 *
 * This is intentionally NOT the state-service-driven `app-search-bar` — Home
 * has no search state of its own; it just routes into the search page.
 */
@Component({
	selector: "app-home-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonComponent, InputComponent],
	templateUrl: "./home-page.html",
})
export class HomePageComponent {
	private readonly router = inject(Router);

	/** Bound to the search input; forwarded as `?q=` on submit. */
	protected readonly term = signal<string>("");

	/** Navigate to the search page, seeding the search term when present. */
	protected onSubmit(event: Event): void {
		event.preventDefault();
		this.browseAll(this.term() || undefined);
	}

	/** Go to the accounts list, optionally with a seeded search term. */
	protected browseAll(q?: string): void {
		void this.router.navigate(["/accounts"], {
			queryParams: q ? { q } : {},
		});
	}
}
