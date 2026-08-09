/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, type MatFormFieldAppearance } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import type { AppFieldSize } from '../field-size';

/** Shape of an option rendered in the dropdown. */
export interface AppSelectOption {
	value: string;
	label: string;
}

/** Thin wrapper over Material's `mat-form-field` + `mat-select`. */
@Component({
	selector: 'app-select',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, MatFormFieldModule, MatSelectModule],
	templateUrl: './select.html',
	styleUrl: './select.scss',
})
export class SelectComponent {
	/** Two-way bindable single-select value. Ignored when `multiple` is set. */
	readonly value = model<string>('');

	/** Two-way bindable multi-select values. Used only when `multiple` is `true`. */
	readonly values = model<readonly string[]>([]);

	/** Render checkbox options and allow more than one selection. */
	readonly multiple = input(false, { transform: booleanAttribute });

	readonly options = input<readonly AppSelectOption[]>([]);
	readonly placeholder = input<string>('');
	readonly label = input<string>('');
	readonly disabled = input<boolean>(false);
	readonly appearance = input<MatFormFieldAppearance>('outline');
	/** Field height: `sm` = 24px, `default` = 32px, `lg` = 40px. */
	readonly size = input<AppFieldSize>('default');

	/** Value handed to `mat-select`: the `values` array when `multiple`, else `value`. */
	protected readonly selection = computed(() => (this.multiple() ? this.values() : this.value()));

	/** Multi-select trigger summary: the sole option's label, else "N selected". */
	protected readonly multiTriggerLabel = computed(() => {
		const selected = this.values();
		if (selected.length === 1) {
			const only = selected[0];
			return this.options().find((o) => o.value === only)?.label ?? only;
		}
		return `${selected.length} selected`;
	});

	/** Single change handler — routes to the right model based on `multiple`. */
	protected onSelectionChange(next: string | string[]): void {
		if (this.multiple()) {
			this.values.set((next as string[]) ?? []);
		} else {
			this.value.set((next as string) ?? '');
		}
	}
}
