/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { Directive } from "@angular/core";
import { FormGroup } from "@angular/forms";

/**
 * Shared helpers for the auth form pages.
 *
 * The base `app-input` primitive exposes a two-way `[(value)]` model rather than
 * a ControlValueAccessor, so neither `formControlName` nor `[formGroup]` can bind
 * to it directly. These pages therefore keep a Reactive Forms `FormGroup` as the
 * validation + submit source of truth (with no `[formGroup]` on the template
 * `<form>`) and bridge each field manually with `[value]` / `(valueChange)`:
 *   <app-input [value]="form.controls.x.value" (valueChange)="setControl('x', $event)" />
 *
 * `setControl` pushes edits back into the control (marking it touched/dirty so
 * validation surfaces), and `controlError` reads a specific error message for
 * display once the control has been touched — mirroring the React forms, which
 * showed field errors after interaction.
 *
 * Kept as an abstract base (not injectable) so each page owns its own typed
 * `form`. Not an Angular component/service; no DI.
 */
@Directive()
export abstract class ReactiveFormPageBase {
	protected abstract readonly form: FormGroup;

	/** Push an edited value into the named control and mark it touched/dirty. */
	protected setControl(name: string, value: string): void {
		const control = this.form.get(name);
		if (!control) return;
		control.setValue(value);
		control.markAsDirty();
		control.markAsTouched();
	}

	/**
	 * Returns the message for the named error key on the control, but only once
	 * the control has been touched (so pristine fields don't show errors).
	 */
	protected controlError(name: string, errorKey: string): string | null {
		const control = this.form.get(name);
		if (!control || !control.touched) return null;
		const message = control.errors?.[errorKey];
		return typeof message === "string" ? message : null;
	}
}
