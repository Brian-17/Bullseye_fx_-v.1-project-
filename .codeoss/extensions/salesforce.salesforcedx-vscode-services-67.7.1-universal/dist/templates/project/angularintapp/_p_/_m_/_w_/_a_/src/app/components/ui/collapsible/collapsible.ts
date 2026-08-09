/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

/**
 * Thin wrapper over Material's `mat-expansion-panel`. Two-way bindable `open`
 * and a `title`; body via `<ng-content>`. For custom header content, omit
 * `title` and project `[collapsibleHeader]`.
 */
@Component({
	selector: 'app-collapsible',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatExpansionModule],
	templateUrl: './collapsible.html',
})
export class CollapsibleComponent {
	/** Two-way bindable expanded state. Supports `[(open)]`. */
	readonly open = model<boolean>(false);

	/** Header title text. Omit and project `[collapsibleHeader]` for custom content. */
	readonly title = input<string>('');
}
