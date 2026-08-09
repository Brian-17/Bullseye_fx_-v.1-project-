/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DataClient } from "../../api/data-client.service";
import { AuthFormComponent } from "../../features/authentication/auth-form/auth-form";
import { ReactiveFormPageBase } from "../../features/authentication/reactive-form-page.base";
import { CardLayoutComponent } from "../../features/authentication/card-layout/card-layout";
import { StatusAlertComponent } from "../../features/authentication/status-alert/status-alert";
import { FieldComponent } from "../../components/ui/field/field";
import { InputComponent } from "../../components/ui/input/input";
import {
	API_ROUTES,
	AUTH_PLACEHOLDERS,
	ROUTES,
} from "../../features/authentication/config/authentication.config";
import { ApiError, handleApiResponse } from "../../features/authentication/utils/helpers";
import {
	passwordMinValidator,
	passwordsMatchValidator,
	requiredWithMessage,
} from "../../features/authentication/utils/auth-validators";

/**
 * Reset-password page — Angular port of the React `ResetPassword`.
 *
 * The reset `token` comes from the `?token=` query param; when absent the page
 * shows the "invalid or expired" card (identical to React) instead of the form.
 * The POST sends `{ token, newPassword }`; on success it shows a success alert
 * with a Sign-in link and scrolls to top.
 */
@Component({
	selector: "app-reset-password-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		AuthFormComponent,
		CardLayoutComponent,
		StatusAlertComponent,
		FieldComponent,
		InputComponent,
	],
	templateUrl: "./reset-password-page.html",
})
export class ResetPasswordPageComponent extends ReactiveFormPageBase {
	private readonly fb = inject(FormBuilder);
	private readonly route = inject(ActivatedRoute);
	private readonly dataClient = inject(DataClient);

	protected readonly placeholders = AUTH_PLACEHOLDERS;
	protected readonly routes = ROUTES;
	protected readonly token = this.route.snapshot.queryParamMap.get("token");

	protected override readonly form = this.fb.group(
		{
			newPassword: ["", [passwordMinValidator]],
			confirmPassword: ["", [requiredWithMessage("Please confirm your password")]],
		},
		{ validators: [passwordsMatchValidator("newPassword", "confirmPassword")] },
	);

	protected readonly submitError = signal<string | string[] | null>(null);
	protected readonly submitting = signal<boolean>(false);
	protected readonly success = signal<boolean>(false);

	protected async onSubmit(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		}
		this.submitError.set(null);
		this.success.set(false);
		this.submitting.set(true);
		try {
			const newPassword = this.form.controls.newPassword.value ?? "";
			const response = await this.dataClient.fetch(API_ROUTES.RESET_PASSWORD, {
				method: "POST",
				body: JSON.stringify({ token: this.token, newPassword }),
				headers: { "Content-Type": "application/json", Accept: "application/json" },
			});
			await handleApiResponse(response);
			this.success.set(true);
			// Scroll to top of page after successful submission so user sees it.
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err) {
			console.error("Password reset failed", err);
			this.submitError.set(err instanceof ApiError ? err.errors : "Password reset failed");
		} finally {
			this.submitting.set(false);
		}
	}
}
