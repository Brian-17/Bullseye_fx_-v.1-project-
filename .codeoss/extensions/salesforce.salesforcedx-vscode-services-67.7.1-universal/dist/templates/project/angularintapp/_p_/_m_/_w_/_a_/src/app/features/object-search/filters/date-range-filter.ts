/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
// Base-app UI wrapper, inherited (not recreated) by this feature. Post-compose
// it lands at uiBundles/<target>/src/app/components/ui/date-range-picker/..., three levels up.
import {
	DateRange,
	DateRangePickerComponent,
} from "../../../components/ui/date-range-picker/date-range-picker";
import { ObjectSearchStateService } from "../object-search-state.service";
import type { FilterFieldConfig, FilterFieldType } from "../utils/filter-utils";
import { toDate, toDateString } from "./date-filter";
import { FilterFieldWrapperComponent } from "./filter-field-wrapper";

/**
 * Date range filter — a single two-ended range picker. Emits a `daterange`
 * (or `datetimerange`) filter with `min` / `max` as `YYYY-MM-DD` strings; the
 * filter builder wires each end into a `gte` / `lte` clause.
 *
 * Thin bridge over the base `app-date-range-picker` (Material's
 * `mat-date-range-picker`): it maps the picker's `DateRange<Date>` value to and
 * from the `min` / `max` string split the filter state stores.
 */
@Component({
	selector: "app-date-range-filter",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DateRangePickerComponent, FilterFieldWrapperComponent],
	templateUrl: "./date-range-filter.html",
})
export class DateRangeFilterComponent {
	private readonly state = inject(ObjectSearchStateService);

	/** Field config: `field`, `label`, `helpText`, ... */
	readonly config = input.required<FilterFieldConfig>();
	/** Underlying filter type — `'daterange'` (default) or `'datetimerange'`. */
	readonly filterType = input<FilterFieldType>("daterange");

	private readonly active = computed(() => this.state.filterFor(this.config().field));

	/** The active filter's `min` / `max` strings surfaced as a picker range. */
	protected readonly range = computed<DateRange<Date>>(
		() => new DateRange(toDate(this.active()?.min), toDate(this.active()?.max)),
	);

	/** Cap the picker at today when the field can't hold a future date. */
	protected readonly maxDate = computed<Date | null>(() =>
		this.config().disableFuture ? new Date() : null,
	);

	protected onRangeChange(range: DateRange<Date> | null): void {
		const cfg = this.config();
		const from = range?.start ?? null;
		const to = range?.end ?? null;
		if (!from && !to) {
			this.state.removeFilter(cfg.field);
			return;
		}
		this.state.setFilter(cfg.field, {
			field: cfg.field,
			label: cfg.label,
			type: this.filterType(),
			min: toDateString(from),
			max: toDateString(to),
		});
	}
}
