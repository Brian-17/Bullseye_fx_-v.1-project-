/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { ButtonComponent } from "../../../components/ui/button/button";
import {
	SelectComponent,
	type AppSelectOption,
} from "../../../components/ui/select/select";
import { ObjectSearchStateService } from "../object-search-state.service";
import type { SortFieldConfig, SortState } from "../utils/sort-utils";

/** Sentinel value used in the select to represent "no sort". */
const NONE_VALUE = "__none__";

/**
 * Sort field + direction toggle. Mirrors the React `SortControl`.
 *
 * Reads `sort()` from the {@link ObjectSearchStateService} and drives changes
 * via `setSort`. Choosing a field applies ASC by default; the direction button
 * flips ASC/DESC and only appears while a sort is active. Selecting `Default`
 * clears the sort (`setSort(null)`).
 */
@Component({
	selector: "app-sort-control",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonComponent, SelectComponent],
	templateUrl: "./sort-control.html",
})
export class SortControlComponent {
	/** Sortable fields to expose in the select. */
	readonly sortFields = input.required<SortFieldConfig[]>();
	/** Override for the leading label (default `Sort by`). */
	readonly label = input<string>("Sort by");

	private readonly state = inject(ObjectSearchStateService);
	/** Current sort state from the shared state service. */
	protected readonly sort = this.state.sort;

	/** Select options — the `Default` sentinel plus one per sortable field. */
	protected readonly options = computed<AppSelectOption[]>(() => [
		{ value: NONE_VALUE, label: "Default" },
		...this.sortFields().map((c) => ({ value: c.field, label: c.label })),
	]);

	/** Value shown in the select — either the current field or the sentinel. */
	protected readonly selectedValue = computed(() => this.sort()?.field ?? NONE_VALUE);

	protected onFieldChange(field: string): void {
		if (field === NONE_VALUE) {
			this.state.setSort(null);
			return;
		}
		const current = this.sort();
		const next: SortState = {
			field,
			direction: current?.direction ?? "ASC",
		};
		this.state.setSort(next);
	}

	protected toggleDirection(): void {
		const current = this.sort();
		if (!current) return;
		this.state.setSort({
			field: current.field,
			direction: current.direction === "ASC" ? "DESC" : "ASC",
		});
	}
}
