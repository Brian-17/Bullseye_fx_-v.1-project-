/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, type MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { AppFieldSize } from '../field-size';

export { DateRange } from '@angular/material/datepicker';

/**
 * Thin wrapper over Material's `mat-form-field` + `mat-date-range-input` +
 * `mat-date-range-picker`. Relies on `provideNativeDateAdapter()`, so the value
 * is Material's `DateRange<Date>` (`{ start, end }`) of plain `Date`s.
 */
@Component({
	selector: 'app-date-range-picker',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
	templateUrl: './date-range-picker.html',
	styleUrl: './date-range-picker.scss',
})
export class DateRangePickerComponent {
	/** Two-way bindable range value. `null` clears the field. Supports `[(value)]`. */
	readonly value = model<DateRange<Date> | null>(null);

	readonly label = input<string>('');
	readonly startPlaceholder = input<string>('Start');
	readonly endPlaceholder = input<string>('End');
	readonly disabled = input<boolean>(false);
	readonly appearance = input<MatFormFieldAppearance>('outline');
	/** Field height: `sm` = 24px, `default` = 32px, `lg` = 40px. */
	readonly size = input<AppFieldSize>('default');

	/** Earliest / latest selectable date; `null` leaves that bound open. */
	readonly min = input<Date | null>(null);
	readonly max = input<Date | null>(null);

	/** When `true`, calendar-only: typing is blocked, clicking opens the picker. */
	readonly readonly = input<boolean>(false);

	/** Start/end come off the range input's `(dateChange)` events as a pair. */
	protected onStartChange(start: Date | null): void {
		this.setRange(start, this.value()?.end ?? null);
	}

	protected onEndChange(end: Date | null): void {
		this.setRange(this.value()?.start ?? null, end);
	}

	/**
	 * Commit a range, guarding against an inverted `start > end` that the two
	 * independent `(dateChange)` events can otherwise produce mid-selection.
	 */
	private setRange(start: Date | null, end: Date | null): void {
		if (start && end && start.getTime() > end.getTime()) {
			this.value.set(new DateRange(end, start));
			return;
		}
		this.value.set(new DateRange(start, end));
	}
}
