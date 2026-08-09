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
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';

/** Layout axis of the separator line. */
export type AppSeparatorOrientation = 'horizontal' | 'vertical';

const BASE_CLASSES = 'shrink-0';
const ORIENTATION_CLASSES: Record<AppSeparatorOrientation, string> = {
	horizontal: 'block w-full',
	vertical: 'self-stretch',
};

/**
 * Divider built on Material's `mat-divider`. `decorative` (default) hides the
 * host from assistive tech (`role="none"`); when false it exposes
 * `role="separator"` + `aria-orientation`. The inner `mat-divider` is marked
 * `role="presentation"` so it never announces a duplicate separator.
 */
@Component({
	selector: 'app-separator',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatDivider],
	templateUrl: './separator.html',
	styleUrl: './separator.scss',
	host: {
		'data-slot': 'separator',
		'[attr.data-orientation]': 'orientation()',
		'[attr.role]': "decorative() ? 'none' : 'separator'",
		'[attr.aria-orientation]':
			"decorative() ? null : (orientation() === 'vertical' ? 'vertical' : 'horizontal')",
		'[class]': 'hostClass()',
	},
})
export class SeparatorComponent {
	readonly orientation = input<AppSeparatorOrientation>('horizontal');
	readonly decorative = input(true, { transform: booleanAttribute });
	/** Adds Material's horizontal inset margin so the line doesn't run edge-to-edge. */
	readonly inset = input(false, { transform: booleanAttribute });

	protected readonly isVertical = computed(() => this.orientation() === 'vertical');

	protected readonly hostClass = computed(
		() => `${BASE_CLASSES} ${ORIENTATION_CLASSES[this.orientation()]}`,
	);
}
