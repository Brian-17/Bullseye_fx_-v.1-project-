/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CardLayoutComponent } from "../card-layout/card-layout";
import { StatusAlertComponent } from "../status-alert/status-alert";
import { SubmitButtonComponent } from "../submit-button/submit-button";
import { FooterLinkComponent } from "../footer-link/footer-link";
import { AuthService } from "../auth/auth.service";

/** Footer link descriptor for the auth form frame. */
export interface AuthFormFooter {
	text?: string;
	link: string;
	linkText: string;
}

/**
 * Wrapper enforcing a consistent layout (card) and error/success alert
 * positioning for all authentication forms — the Angular port of the React
 * `AuthForm`.
 *
 * Auth-aware behavior (identical to React):
 * - While auth state is loading, the submit button is disabled.
 * - If the user is already authenticated and `showAlreadyLoggedIn` is true, an
 *   info alert is shown and submit is disabled.
 *
 * The owning page holds the FormGroup and binds `[formGroup]` on the projected
 * `<form>`; this component renders the frame, alerts, submit button, and footer.
 * It emits `(submitted)` when the submit button is pressed so the page runs its
 * submit handler. The page passes its submitting flag via `[submitting]` and any
 * extra disabled condition via `[submitDisabled]`.
 */
@Component({
	selector: "app-auth-form",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		FormsModule,
		CardLayoutComponent,
		StatusAlertComponent,
		SubmitButtonComponent,
		FooterLinkComponent,
	],
	templateUrl: "./auth-form.html",
})
export class AuthFormComponent {
	private readonly authService = inject(AuthService);

	readonly title = input.required<string>();
	readonly description = input<string>("");
	/** Error message(s) to surface; empty/null hides the error alert. */
	readonly error = input<string | string[] | null>(null);
	/** Success message to surface; empty/null hides the success alert. */
	readonly success = input<string | null>(null);
	/** Whether to show the "already logged in" alert and disable submit. @default true */
	readonly showAlreadyLoggedIn = input<boolean>(true);
	readonly submitText = input.required<string>();
	readonly submitLoadingText = input<string>("Submitting…");
	/** True while the page's async submit is in flight. */
	readonly submitting = input<boolean>(false);
	/** Extra disabled condition from the page (e.g. success state). */
	readonly submitDisabled = input<boolean>(false);
	readonly footer = input<AuthFormFooter | null>(null);

	/** Emitted when the submit button is pressed (page runs its handler). */
	readonly submitted = output<void>();

	protected readonly isAuthenticated = this.authService.isAuthenticated;
	protected readonly loading = this.authService.loading;

	/** Info alert shown when already authenticated on a public page. */
	protected readonly showAuthAlert = computed(
		() => this.showAlreadyLoggedIn() && this.isAuthenticated(),
	);

	/** Submit disabled when: caller says so, already-logged-in, or auth loading. */
	protected readonly isSubmitDisabled = computed(
		() => this.submitDisabled() || this.showAuthAlert() || this.loading(),
	);

	/** Normalizes the error input to an array for the template's list rendering. */
	protected readonly errorMessages = computed<string[]>(() => {
		const err = this.error();
		if (!err) return [];
		return Array.isArray(err) ? err : [err];
	});

	protected onSubmit(): void {
		this.submitted.emit();
	}
}
