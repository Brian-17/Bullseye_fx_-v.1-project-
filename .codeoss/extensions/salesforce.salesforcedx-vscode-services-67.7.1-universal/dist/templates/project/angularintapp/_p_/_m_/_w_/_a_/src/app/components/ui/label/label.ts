/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Thin wrapper over the native `<label>` element. */
@Component({
	selector: 'app-label',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './label.html',
})
export class LabelComponent {
	/** Optional `for` attribute forwarded to the underlying `<label>`. */
	readonly for = input<string | null>(null);
}
