/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { DataClient } from "../../api/data-client.service";
import { AuthFormComponent } from "../../features/authentication/auth-form/auth-form";
import { ReactiveFormPageBase } from "../../features/authentication/reactive-form-page.base";
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
 * Change-password page — Angular port of the React `ChangePassword`. Protected
 * route (guarded in `app.routes.ts`). Sends `{ currentPassword, newPassword }`;
 * on success it resets the form and shows a success alert with a Back-to-Profile
 * link. `showAlreadyLoggedIn` is false (the user is expected to be logged in).
 */
@Component({
	selector: "app-change-password-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AuthFormComponent, FieldComponent, InputComponent],
	templateUrl: "./change-password-page.html",
})
export class ChangePasswordPageComponent extends ReactiveFormPageBase {
	private readonly fb = inject(FormBuilder);
	private readonly dataClient = inject(DataClient);

	protected readonly placeholders = AUTH_PLACEHOLDERS;
	protected readonly routes = ROUTES;

	protected override readonly form = this.fb.group(
		{
			currentPassword: ["", [requiredWithMessage("Current password is required")]],
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
			const { currentPassword, newPassword } = this.form.getRawValue();
			const response = await this.dataClient.fetch(API_ROUTES.CHANGE_PASSWORD, {
				method: "POST",
				body: JSON.stringify({ currentPassword, newPassword }),
				headers: { "Content-Type": "application/json", Accept: "application/json" },
			});
			await handleApiResponse(response);
			this.success.set(true);
			this.form.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
		} catch (err) {
			console.error("Password change failed", err);
			this.submitError.set(err instanceof ApiError ? err.errors : "Password change failed");
		} finally {
			this.submitting.set(false);
		}
	}
}
