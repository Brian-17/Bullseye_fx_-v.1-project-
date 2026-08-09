/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, type MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { AppFieldSize } from '../field-size';

/** Thin wrapper over Material's `mat-form-field` + `matInput`. */
@Component({
	selector: 'app-input',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, MatFormFieldModule, MatInputModule],
	templateUrl: './input.html',
	styleUrl: './input.scss',
})
export class InputComponent {
	/** Two-way bindable value. Supports `[(value)]`. */
	readonly value = model<string>('');

	readonly placeholder = input<string>('');
	readonly label = input<string>('');
	readonly type = input<string>('text');
	readonly disabled = input<boolean>(false);
	readonly appearance = input<MatFormFieldAppearance>('outline');
	/** Field height: `sm` = 24px, `default` = 32px, `lg` = 40px. */
	readonly size = input<AppFieldSize>('default');

	/** `id` on the inner control, so an outer `app-field` label's `for` resolves. */
	readonly id = input<string>('');

	readonly ariaDescribedby = input<string>('');
}
