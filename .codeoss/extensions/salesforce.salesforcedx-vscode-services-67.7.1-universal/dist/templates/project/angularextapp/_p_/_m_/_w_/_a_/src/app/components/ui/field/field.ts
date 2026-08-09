/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Form-field wrapper: renders a `<label>`, the projected control, and an error
 * message when present. Composes around `app-input` and other controls.
 */
@Component({
	selector: 'app-field',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './field.html',
	host: {
		'data-slot': 'field',
		class: 'flex flex-col gap-1.5',
	},
})
export class FieldComponent {
	/** Optional label text rendered above the control. */
	readonly label = input<string>('');

	/**
	 * Error message; renders in a `role="alert"` region. When `htmlFor` is set
	 * the region gets id `<htmlFor>-error` for the control's `aria-describedby`.
	 */
	readonly error = input<string | null>(null);

	/** Marks the field required and renders an asterisk next to the label. */
	readonly required = input<boolean>(false);

	/** `id` of the projected control; forwarded to the label's `for`. */
	readonly htmlFor = input<string | null>(null);
}
