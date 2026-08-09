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
import type { AbstractControl, ValidationErrors } from "@angular/forms";

/**
 * Username validator — mirrors the React forgot-password zod schema which
 * validates the username as an email but with the message "Please enter a
 * valid username". Kept local since this message is unique to this page.
 */
function usernameValidator(control: AbstractControl): ValidationErrors | null {
	const value = (control.value ?? "").toString().trim();
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return value !== "" && emailPattern.test(value)
		? null
		: { email: "Please enter a valid username" };
}

/**
 * Forgot-password page — Angular port of the React `ForgotPassword`.
 *
 * Anti-enumeration: the success message is intentionally generic ("If that
 * username exists…") regardless of whether the account exists, and after a
 * successful submit the username field and the submit button are disabled — an
 * exact mirror of the React behavior.
 */
@Component({
	selector: "app-forgot-password-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AuthFormComponent, FieldComponent, InputComponent],
	templateUrl: "./forgot-password-page.html",
})
export class ForgotPasswordPageComponent extends ReactiveFormPageBase {
	private readonly fb = inject(FormBuilder);
	private readonly dataClient = inject(DataClient);

	protected readonly placeholders = AUTH_PLACEHOLDERS;
	protected readonly routes = ROUTES;

	protected override readonly form = this.fb.group({
		username: ["", [usernameValidator]],
	});

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
			const username = (this.form.controls.username.value ?? "").trim();
			const response = await this.dataClient.fetch(API_ROUTES.FORGOT_PASSWORD, {
				method: "POST",
				body: JSON.stringify({ username }),
				headers: { "Content-Type": "application/json", Accept: "application/json" },
			});
			await handleApiResponse(response);
			this.success.set(true);
		} catch (err) {
			console.error("Failed to send reset link", err);
			this.submitError.set(err instanceof ApiError ? err.errors : "Failed to send reset link");
		} finally {
			this.submitting.set(false);
		}
	}
}
