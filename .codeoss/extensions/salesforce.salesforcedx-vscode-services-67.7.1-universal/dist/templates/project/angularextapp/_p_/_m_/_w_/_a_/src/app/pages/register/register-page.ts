/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
import { getStartUrl, type AuthResponse } from "../../features/authentication/utils/auth-helpers";
import { ApiError, handleApiResponse } from "../../features/authentication/utils/helpers";
import {
	emailValidator,
	passwordMinValidator,
	passwordsMatchValidator,
	requiredWithMessage,
} from "../../features/authentication/utils/auth-validators";

/**
 * Register page — Angular port of the React `Register`. Same field set, same
 * cross-field password-match rule, same POST body shape (`{ request }` with
 * `confirmPassword` stripped) and same success handling (redirectUrl hard-nav,
 * else navigate to login).
 */
@Component({
	selector: "app-register-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AuthFormComponent, FieldComponent, InputComponent],
	templateUrl: "./register-page.html",
})
export class RegisterPageComponent extends ReactiveFormPageBase {
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly dataClient = inject(DataClient);

	protected readonly placeholders = AUTH_PLACEHOLDERS;
	protected readonly routes = ROUTES;

	protected override readonly form = this.fb.group(
		{
			firstName: ["", [requiredWithMessage("First name is required")]],
			lastName: ["", [requiredWithMessage("Last name is required")]],
			email: ["", [emailValidator]],
			password: ["", [passwordMinValidator]],
			confirmPassword: ["", [requiredWithMessage("Please confirm your password")]],
			startUrl: [getStartUrl(this.route.snapshot.queryParamMap) || ""],
		},
		{ validators: [passwordsMatchValidator("password", "confirmPassword")] },
	);

	protected readonly submitError = signal<string | string[] | null>(null);
	protected readonly submitting = signal<boolean>(false);

	protected async onSubmit(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		}
		this.submitError.set(null);
		this.submitting.set(true);
		try {
			const { confirmPassword: _confirmPassword, ...request } = this.form.getRawValue();
			const response = await this.dataClient.fetch(API_ROUTES.REGISTER, {
				method: "POST",
				body: JSON.stringify({ request }),
				headers: { "Content-Type": "application/json", Accept: "application/json" },
			});
			const result = await handleApiResponse<AuthResponse>(response);
			if (result?.redirectUrl) {
				// Hard navigate to the URL which logs the new user in.
				window.location.replace(result.redirectUrl);
			} else {
				// In case redirectUrl is null, redirect to the login page.
				void this.router.navigate([ROUTES.LOGIN.PATH], { replaceUrl: true });
			}
		} catch (err) {
			console.error("Registration failed", err);
			this.submitError.set(err instanceof ApiError ? err.errors : "Registration failed");
		} finally {
			this.submitting.set(false);
		}
	}
}
