/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
	CardComponent,
	CardContentComponent,
	CardDescriptionComponent,
	CardHeaderComponent,
	CardTitleComponent,
} from "../../../components/ui/card/card";

/**
 * Centered page shell for auth pages — a feature-owned composition over the base
 * `app-card` ui primitives (not a base-template component). Renders a single
 * `app-card` centered in the viewport with an optional title / subtitle header,
 * and content-projects the page body.
 *
 * Consumed by the authentication login / register / reset pages as the
 * `CenteredPageLayout` analogue's card frame. Tailwind utilities pass through
 * via the host `class`.
 */
@Component({
	selector: "app-card-layout",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		CardHeaderComponent,
		CardTitleComponent,
		CardDescriptionComponent,
		CardContentComponent,
	],
	templateUrl: "./card-layout.html",
})
export class CardLayoutComponent {
	readonly title = input<string>("");
	readonly subtitle = input<string | null>(null);
}
