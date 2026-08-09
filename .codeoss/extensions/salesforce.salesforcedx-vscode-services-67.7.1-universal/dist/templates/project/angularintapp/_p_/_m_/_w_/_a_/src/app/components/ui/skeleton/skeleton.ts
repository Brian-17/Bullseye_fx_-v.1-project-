/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Loading skeleton — a pulsing block sized by host `class` utilities (e.g.
 * `class="h-4 w-32"`); it has no intrinsic size, so always set width/height.
 * `aria-hidden`, so announce loading via the container's `aria-busy`.
 */
@Component({
	selector: 'app-skeleton',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './skeleton.html',
	styleUrl: './skeleton.scss',
	host: {
		'data-slot': 'skeleton',
		'aria-hidden': 'true',
		class: 'bg-accent rounded-md',
	},
})
export class SkeletonComponent {}
