/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Angular Reactive Forms validators that mirror the React feature's zod schemas
 * (`authHelpers.ts`). The React port dropped zod in favour of native Angular
 * validators; these reproduce the same rules and messages so the UX is
 * identical. Each validator returns `{ <key>: message }` on failure and `null`
 * on success; templates read the first message via `control.errors`.
 */

/** Mirrors zod `emailSchema`: trimmed, valid email. */
export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const value = (control.value ?? "").toString().trim();
	if (value === "") {
		return { email: "Please enter a valid email address" };
	}
	// Same intent as zod's email check: a single @ with non-empty local/domain
	// parts and a dotted domain. Kept deliberately permissive, like zod.
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(value) ? null : { email: "Please enter a valid email address" };
};

/** Mirrors zod `passwordSchema`: minimum 8 characters. */
export const passwordMinValidator: ValidatorFn = (
	control: AbstractControl,
): ValidationErrors | null => {
	const value = (control.value ?? "").toString();
	return value.length >= 8 ? null : { password: "Password must be at least 8 characters" };
};

/** A required-with-custom-message validator (mirrors zod `min(1, message)`). */
export function requiredWithMessage(message: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = (control.value ?? "").toString().trim();
		return value.length >= 1 ? null : { required: message };
	};
}

/**
 * Cross-field validator mirroring the `newPasswordSchema` refine: the
 * `confirmPassword` control must equal the `newPassword` control. Attach to the
 * FormGroup; sets `{ passwordMismatch: '...' }` on the confirm control (matching
 * the zod `path: ['confirmPassword']`) so the error renders under that field.
 */
export function passwordsMatchValidator(
	passwordKey = "newPassword",
	confirmKey = "confirmPassword",
): ValidatorFn {
	return (group: AbstractControl): ValidationErrors | null => {
		const password = group.get(passwordKey);
		const confirm = group.get(confirmKey);
		if (!password || !confirm) {
			return null;
		}
		if (confirm.value !== password.value) {
			const existing = confirm.errors ?? {};
			confirm.setErrors({ ...existing, passwordMismatch: "Passwords do not match" });
			return { passwordMismatch: "Passwords do not match" };
		}
		// Clear only our own error, preserving any other errors on the control.
		if (confirm.errors) {
			const { passwordMismatch: _removed, ...rest } = confirm.errors;
			confirm.setErrors(Object.keys(rest).length ? rest : null);
		}
		return null;
	};
}
