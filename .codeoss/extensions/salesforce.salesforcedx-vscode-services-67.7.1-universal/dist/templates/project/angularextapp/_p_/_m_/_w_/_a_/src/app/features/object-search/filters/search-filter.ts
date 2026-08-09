/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	inject,
	input,
	signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
// Base-app UI wrapper, inherited (not recreated) by this feature. Post-compose
// it lands at uiBundles/<target>/src/app/components/ui/input/..., three levels up.
import { InputComponent } from "../../../components/ui/input/input";
import { ObjectSearchStateService } from "../object-search-state.service";
import { FILTER_DEBOUNCE_MS } from "../utils/debounce";
import type { FilterFieldConfig } from "../utils/filter-utils";
import { FilterFieldWrapperComponent } from "./filter-field-wrapper";

/**
 * Multi-field search filter — a debounced input whose value is applied via
 * `like %value%` across every field named in `config.searchFields` (combined
 * with a top-level `or`, see {@link buildFilter}).
 *
 * Shape mirrors {@link TextFilterComponent} but emits a `type: 'search'`
 * {@link ActiveFilterValue} so `filter-utils` picks the multi-field path.
 */
@Component({
	selector: "app-search-filter",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [InputComponent, FilterFieldWrapperComponent],
	templateUrl: "./search-filter.html",
})
export class SearchFilterComponent {
	private readonly state = inject(ObjectSearchStateService);
	private readonly destroyRef = inject(DestroyRef);

	/** Field config: `field`, `label`, `placeholder`, `searchFields`, ... */
	readonly config = input.required<FilterFieldConfig>();

	protected readonly localValue = signal<string>("");
	protected readonly inputId = signal<string>("");
	private readonly commit$ = new Subject<string>();

	constructor() {
		this.commit$
			.pipe(debounceTime(FILTER_DEBOUNCE_MS), takeUntilDestroyed(this.destroyRef))
			.subscribe((v) => this.commit(v));

		effect(() => {
			const cfg = this.config();
			this.inputId.set(`filter-${cfg.field}`);
			const external = this.state.filterFor(cfg.field)?.value ?? "";
			this.localValue.set(external);
		});
	}

	protected onValueChange(v: string): void {
		this.localValue.set(v);
		this.commit$.next(v);
	}

	private commit(v: string): void {
		const cfg = this.config();
		if (v) {
			this.state.setFilter(cfg.field, {
				field: cfg.field,
				label: cfg.label,
				type: "search",
				value: v,
			});
		} else {
			this.state.removeFilter(cfg.field);
		}
	}
}
