/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { AlertComponent } from "../../../components/ui/alert/alert";

/** Status banner variant conveying the tone of the message. */
export type AppStatusAlertVariant = "error" | "success" | "info" | "warning";

/**
 * Status / error banner — a feature-owned composition over the base `app-alert`
 * ui primitive (not a base-template component). Adds a four-way `variant` with a
 * colour treatment, mirroring the React `components/alerts/status-alert`.
 *
 * Supply the copy via the `message` input, or content-project richer markup
 * (lists, links) as the default slot. Consumed by the authentication
 * login-error / success / session-expired banners.
 */
@Component({
	selector: "app-status-alert",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AlertComponent],
	templateUrl: "./status-alert.html",
	host: {
		"data-slot": "status-alert",
	},
})
export class StatusAlertComponent {
	readonly variant = input<AppStatusAlertVariant>("info");

	/** Optional title rendered above the message / projected content. */
	readonly title = input<string>("");

	/** Message copy; may be omitted in favour of projected content. */
	readonly message = input<string>("");

	/** Colour utilities applied to the banner for the current variant. */
	protected readonly toneClass = computed(() => {
		switch (this.variant()) {
			case "error":
				return "text-destructive";
			case "success":
				return "text-emerald-700";
			case "warning":
				return "text-amber-700";
			default:
				return "text-sky-700";
		}
	});
}
