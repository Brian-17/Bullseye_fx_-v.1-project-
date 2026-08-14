/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
// Base-app UI wrapper, inherited (not recreated) by this feature. Post-compose
// it lands at uiBundles/<target>/src/app/components/ui/select/..., three levels up.
import {
	SelectComponent,
	type AppSelectOption,
} from "../../../components/ui/select/select";
import { ObjectSearchStateService } from "../object-search-state.service";
import type { FilterFieldConfig } from "../utils/filter-utils";
import { FilterFieldWrapperComponent } from "./filter-field-wrapper";

/**
 * Single-value picklist filter — a select rendered from `config.options` with
 * a leading "All" entry (empty value) that clears the filter.
 *
 * Emits a `type: 'picklist'` filter which `buildSingleFilter` maps to
 * `{ [field]: { eq: value } }`.
 */
const ALL_VALUE = "";

@Component({
	selector: "app-select-filter",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SelectComponent, FilterFieldWrapperComponent],
	templateUrl: "./select-filter.html",
})
export class SelectFilterComponent {
	private readonly state = inject(ObjectSearchStateService);

	/** Field config: `field`, `label`, `options`, `helpText`, ... */
	readonly config = input.required<FilterFieldConfig>();

	/** DOM id shared by the wrapper label and the underlying control. */
	protected readonly inputId = computed(() => `filter-${this.config().field}`);

	/** Options rendered in the select, with an "All" (clear) sentinel prepended. */
	protected readonly options = computed<readonly AppSelectOption[]>(() => [
		{ value: ALL_VALUE, label: "All" },
		...(this.config().options ?? []),
	]);

	/** Current selection, reading through to shared state so URL changes reflect. */
	protected readonly currentValue = computed(
		() => this.state.filterFor(this.config().field)?.value ?? ALL_VALUE,
	);

	protected onValueChange(v: string): void {
		const cfg = this.config();
		if (v === ALL_VALUE) {
			this.state.removeFilter(cfg.field);
		} else {
			this.state.setFilter(cfg.field, {
				field: cfg.field,
				label: cfg.label,
				type: "picklist",
				value: v,
			});
		}
	}
}
