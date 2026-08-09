/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
	requiredWithMessage,
} from "../../features/authentication/utils/auth-validators";

/**
 * Login page — Angular port of the React `Login`. Reactive Forms replace
 * `@tanstack/react-form` + zod; the login POST + redirect logic is identical.
 * On success with a `redirectUrl` it hard-navigates (establishes the server
 * session cookie); otherwise it client-navigates to `/`.
 */
@Component({
	selector: "app-login-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, AuthFormComponent, FieldComponent, InputComponent],
	templateUrl: "./login-page.html",
})
export class LoginPageComponent extends ReactiveFormPageBase {
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly dataClient = inject(DataClient);

	protected readonly placeholders = AUTH_PLACEHOLDERS;
	protected readonly routes = ROUTES;

	protected override readonly form = this.fb.group({
		email: ["", [emailValidator]],
		password: ["", [requiredWithMessage("Password is required")]],
	});

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
			const { email, password } = this.form.getRawValue();
			const startUrl = getStartUrl(this.route.snapshot.queryParamMap);
			const response = await this.dataClient.fetch(API_ROUTES.LOGIN, {
				method: "POST",
				body: JSON.stringify({
					email: (email ?? "").trim().toLowerCase(),
					password: password ?? "",
					startUrl,
				}),
				headers: { "Content-Type": "application/json", Accept: "application/json" },
			});
			const result = await handleApiResponse<AuthResponse>(response);
			if (result?.redirectUrl) {
				// Hard navigate to the URL which establishes the server session cookie.
				window.location.replace(result.redirectUrl);
			} else {
				// In case redirectUrl is null, navigate to home.
				void this.router.navigate(["/"], { replaceUrl: true });
			}
		} catch (err) {
			console.error("Login failed", err);
			this.submitError.set(err instanceof ApiError ? err.errors : "Login failed");
		} finally {
			this.submitting.set(false);
		}
	}
}
