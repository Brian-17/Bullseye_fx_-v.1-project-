/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

/**
 * Modal dialog backed by CDK Overlay. Slots: `[header]`, default (body),
 * `[footer]`. `open` is a two-way model; a backdrop click or Escape closes it
 * and emits `(closed)`. `cdkTrapFocus` keeps focus inside the panel while open.
 */
@Component({
	selector: 'app-dialog',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CdkConnectedOverlay, CdkTrapFocus],
	templateUrl: './dialog.html',
})
export class DialogComponent {
	/** Two-way bindable open state. Supports `[(open)]`. */
	readonly open = model<boolean>(false);

	/** When true a backdrop click closes the dialog. */
	readonly closeOnBackdrop = input<boolean>(true);

	/** Accessible name for the dialog (or use `ariaLabelledby`). */
	readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** `id` of an element (e.g. the projected header) that names the dialog. */
	readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** Emitted whenever the dialog transitions to closed. */
	readonly closed = output<void>();

	/** Imperatively open the dialog. */
	show(): void {
		this.open.set(true);
	}

	/** Imperatively close the dialog and notify listeners. */
	close(): void {
		if (this.open()) {
			this.open.set(false);
			this.closed.emit();
		}
	}

	protected onBackdropClick(): void {
		if (this.closeOnBackdrop()) {
			this.close();
		}
	}
}
