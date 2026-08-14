/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ButtonComponent } from "../../../components/ui/button/button";
import { SpinnerComponent } from "../../../components/ui/spinner/spinner";

/**
 * Submit button that reflects form submission state — the Angular port of the
 * React `SubmitButton`, which subscribed to `form.isSubmitting`.
 *
 * Reactive Forms have no equivalent subscription; instead the parent passes the
 * form's `pending`/submitting flag via `[submitting]` and the caller-provided
 * `[disabled]`. While submitting the button is disabled and shows a spinner with
 * the loading label — the same UX (prevents double-submit + gives feedback).
 */
@Component({
	selector: "app-submit-button",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonComponent, SpinnerComponent],
	templateUrl: "./submit-button.html",
	styleUrl: "./submit-button.scss",
})
export class SubmitButtonComponent {
	/** Button text when not submitting. */
	readonly label = input.required<string>();
	/** Button text while submitting. */
	readonly loadingLabel = input<string>("Submitting…");
	/** True while the form submission is in flight. */
	readonly submitting = input<boolean>(false);
	/** Additional disabled condition from the caller (e.g. already authenticated). */
	readonly disabled = input<boolean>(false);
}
