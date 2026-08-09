/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';

/**
 * Thin wrapper over Material's `mat-progress-spinner`. Defaults to an
 * indeterminate 24px spinner. `ariaLabel` names the `role="progressbar"`.
 */
@Component({
	selector: 'app-spinner',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatProgressSpinnerModule],
	template: `
		<mat-progress-spinner
			[mode]="mode()"
			[diameter]="diameter()"
			[value]="value()"
			[attr.aria-label]="ariaLabel()"
		/>
	`,
})
export class SpinnerComponent {
	readonly diameter = input<number>(24);
	readonly mode = input<ProgressSpinnerMode>('indeterminate');

	/** Progress value (0–100) used only when `mode` is `determinate`. */
	readonly value = input<number>(0);

	/** Accessible name announced by assistive tech. */
	readonly ariaLabel = input<string>('Loading', { alias: 'aria-label' });
}
