/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, type MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { AppFieldSize } from '../field-size';

/**
 * Thin wrapper over Material's `mat-form-field` + `matInput` + `mat-datepicker`.
 * Relies on `provideNativeDateAdapter()`, so `value` is a plain `Date`.
 */
@Component({
	selector: 'app-date-picker',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
	templateUrl: './date-picker.html',
	styleUrl: './date-picker.scss',
})
export class DatePickerComponent {
	/** Two-way bindable date value. `null` clears the field. Supports `[(value)]`. */
	readonly value = model<Date | null>(null);

	readonly label = input<string>('');
	readonly placeholder = input<string>('');
	readonly disabled = input<boolean>(false);
	readonly appearance = input<MatFormFieldAppearance>('outline');
	/** Field height: `sm` = 24px, `default` = 32px, `lg` = 40px. */
	readonly size = input<AppFieldSize>('default');

	/** Earliest / latest selectable date; `null` leaves that bound open. */
	readonly min = input<Date | null>(null);
	readonly max = input<Date | null>(null);

	/** When `true`, calendar-only: typing is blocked, clicking opens the picker. */
	readonly readonly = input<boolean>(false);
}
