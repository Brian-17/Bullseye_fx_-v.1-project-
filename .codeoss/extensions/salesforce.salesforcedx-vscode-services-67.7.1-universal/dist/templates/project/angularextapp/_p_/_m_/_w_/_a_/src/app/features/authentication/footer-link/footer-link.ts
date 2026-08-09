/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

/**
 * Footer navigation link under an auth form — the Angular port of the React
 * `FooterLink`. Renders an optional prefix text followed by a `routerLink`.
 */
@Component({
	selector: "app-footer-link",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./footer-link.html",
})
export class FooterLinkComponent {
	/** Link text prefix (e.g., "Don't have an account?"). */
	readonly text = input<string>("");
	/** Router path to navigate to. */
	readonly to = input.required<string>();
	/** Link label (e.g., "Sign up"). */
	readonly linkText = input.required<string>();
}
