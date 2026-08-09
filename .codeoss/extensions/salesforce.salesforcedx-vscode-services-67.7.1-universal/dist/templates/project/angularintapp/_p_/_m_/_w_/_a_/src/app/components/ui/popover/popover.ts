/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/**
 * Popover backed by CDK Overlay. Slots: `[trigger]` (anchor, toggles the
 * popover) and default (body). `open` is a two-way model; a backdrop click
 * closes it.
 */
@Component({
	selector: 'app-popover',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CdkConnectedOverlay, CdkOverlayOrigin],
	templateUrl: './popover.html',
})
export class PopoverComponent {
	/**
	 * Two-way bindable open state. Supports `[(open)]`, a plain `[open]`
	 * input, or listening to the auto-generated `(openChange)` event.
	 */
	readonly open = model<boolean>(false);

	/** Panel alignment relative to the trigger. Defaults to below-start. */
	readonly align = input<'start' | 'center' | 'end'>('start');

	/** Vertical gap between the trigger and the panel, in px. */
	readonly sideOffset = input<number>(4);

	toggle(): void {
		this.open.set(!this.open());
	}

	close(): void {
		this.open.set(false);
	}
}
