/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Visual variant. */
export type AppAlertVariant = 'default' | 'destructive';

const BASE_CLASSES =
	'relative w-full grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-[app-alert-action]:pr-18';
const VARIANT_CLASSES: Record<AppAlertVariant, string> = {
	default: 'bg-card text-card-foreground',
	destructive: 'bg-card text-destructive',
};

/** Alert banner. Optional trailing control via the `app-alert-action` slot. */
@Component({
	selector: 'app-alert',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatIconModule],
	templateUrl: './alert.html',
	host: {
		'data-slot': 'alert',
		role: 'alert',
		'[class]': 'hostClass()',
	},
})
export class AlertComponent {
	readonly variant = input<AppAlertVariant>('default');
	readonly title = input<string>('');
	readonly description = input<string>('');
	/** Material icon ligature name, e.g. `info`, `error`, `warning`. */
	readonly icon = input<string>('');

	protected readonly hostClass = computed(
		() => `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant()]}`,
	);
}

/** Trailing action slot for `app-alert`, pinned to the top-right. */
@Component({
	selector: 'app-alert-action',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	host: {
		'data-slot': 'alert-action',
		class: 'absolute top-2 right-2',
	},
})
export class AlertActionComponent {}
