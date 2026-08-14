/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	inject,
	input,
	type OnInit,
	signal,
} from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs/operators";
import { ButtonComponent } from "../../../components/ui/button/button";
import { InputComponent } from "../../../components/ui/input/input";
import { PopoverComponent } from "../../../components/ui/popover/popover";
import { ObjectSearchStateService } from "../object-search-state.service";
import type { FilterFieldConfig } from "../utils/filter-utils";

/** How long to wait after the last keystroke before writing to state. */
const SEARCH_DEBOUNCE_MS = 300;

/**
 * Search-bar header for an object-search page: a debounced text input bound to
 * the `search` filter, plus an optional filter popover that content-projects
 * the sibling filter components (owned by the filters wave).
 *
 * Mirrors the React `SearchBar`, with the composed additions from the ground-
 * truth example page (filter panel toggle). Filter components are NOT imported
 * here — the hosting page projects them via the `[filters]` slot so the
 * feature can pick which filters it renders.
 *
 * ## Usage
 * ```html
 * <app-search-bar [searchConfig]="searchCfg" [filterConfigs]="filterCfgs">
 *   <div filters>
 *     <app-text-filter .../>
 *     <app-select-filter .../>
 *   </div>
 * </app-search-bar>
 * ```
 */
@Component({
	selector: "app-search-bar",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonComponent, InputComponent, PopoverComponent],
	templateUrl: "./search-bar.html",
})
export class SearchBarComponent implements OnInit {
	/** Config for the multi-field search filter (its label, placeholder, etc.). */
	readonly searchConfig = input.required<FilterFieldConfig>();
	/**
	 * Configs for the filters projected into the popover. Not consumed directly
	 * here — surfaced so the hosting page and this component agree on which
	 * filters exist, and reserved for a future filter-count badge.
	 */
	readonly filterConfigs = input<FilterFieldConfig[]>([]);

	private readonly state = inject(ObjectSearchStateService);
	private readonly destroyRef = inject(DestroyRef);

	/** Local, debounced mirror of the search filter's `value`. */
	protected readonly term = signal<string>("");
	protected readonly popoverOpen = signal<boolean>(false);

	/** Count of currently active filters minus the search itself (for the badge). */
	protected readonly nonSearchFilterCount = computed(
		() => this.state.filters().filter((f) => f.type !== "search").length,
	);

	constructor() {
		// Required inputs are not yet resolved in the constructor, so the search
		// config is read lazily inside the subscription (which emits after init).
		toObservable(this.term)
			.pipe(debounceTime(SEARCH_DEBOUNCE_MS), takeUntilDestroyed(this.destroyRef))
			.subscribe((value) => {
				const cfg = this.searchConfig();
				if (value) {
					this.state.setFilter(cfg.field, {
						field: cfg.field,
						label: cfg.label,
						type: cfg.type,
						value,
					});
				} else {
					this.state.removeFilter(cfg.field);
				}
			});
	}

	ngOnInit(): void {
		// Seed the local term from any existing search filter (deep-link support).
		// Done here (not the constructor) so the required `searchConfig` input is
		// resolved before it is read.
		const existing = this.state.filterFor(this.searchConfig().field);
		if (existing?.value) {
			this.term.set(existing.value);
		}
	}

	protected togglePopover(): void {
		this.popoverOpen.set(!this.popoverOpen());
	}
}
