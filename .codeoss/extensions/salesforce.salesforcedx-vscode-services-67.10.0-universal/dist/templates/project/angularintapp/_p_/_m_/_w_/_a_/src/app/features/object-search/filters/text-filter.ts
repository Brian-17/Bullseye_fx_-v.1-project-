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
 * Text filter — free-text input that writes a `like %value%` clause via
 * {@link ObjectSearchStateService.setFilter}. Keystrokes update the local
 * signal immediately (for a responsive UI) and flush to shared state on a
 * {@link FILTER_DEBOUNCE_MS}ms trailing debounce (to avoid a query per key).
 *
 * Reads the current value from `state.filterFor(config.field)` so URL /
 * reset-all changes reflect back into the input.
 */
@Component({
	selector: "app-text-filter",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [InputComponent, FilterFieldWrapperComponent],
	templateUrl: "./text-filter.html",
})
export class TextFilterComponent {
	private readonly state = inject(ObjectSearchStateService);
	private readonly destroyRef = inject(DestroyRef);

	/** Field config: `field`, `label`, `placeholder`, `helpText`, ... */
	readonly config = input.required<FilterFieldConfig>();

	/** Local (uncommitted) value that drives the input while the user is typing. */
	protected readonly localValue = signal<string>("");

	/** DOM id shared by the wrapper label and the underlying input. */
	protected readonly inputId = signal<string>("");

	/** Coalesces rapid keystrokes into one shared-state write. */
	private readonly commit$ = new Subject<string>();

	constructor() {
		this.commit$
			.pipe(debounceTime(FILTER_DEBOUNCE_MS), takeUntilDestroyed(this.destroyRef))
			.subscribe((v) => this.commit(v));

		// Sync the input with the shared state (URL restore, reset-all, ...).
		// Mirrors the React "reset local when external changes" pattern.
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
				type: "text",
				value: v,
			});
		} else {
			this.state.removeFilter(cfg.field);
		}
	}
}
