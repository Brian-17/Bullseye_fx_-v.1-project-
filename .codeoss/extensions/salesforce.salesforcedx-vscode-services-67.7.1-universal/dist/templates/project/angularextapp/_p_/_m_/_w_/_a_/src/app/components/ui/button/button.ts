/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule, type MatButtonAppearance } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** Material's appearances plus `destructive`, which Material doesn't provide. */
export type AppButtonAppearance = MatButtonAppearance | 'destructive';

/** Button size variants. */
export type AppButtonSize =
	| 'default'
	| 'xs'
	| 'sm'
	| 'lg'
	| 'icon'
	| 'icon-xs'
	| 'icon-sm'
	| 'icon-lg';

/**
 * Thin wrapper over `matButton`. Adds a `destructive` appearance and a `size`
 * scale Material lacks; inputs drive the inner button (a host class/aria attr
 * would land on `<app-button>`, not the real `<button>`).
 */
@Component({
	selector: 'app-button',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatButtonModule, MatIconModule],
	templateUrl: './button.html',
	styleUrl: './button.scss',
})
export class ButtonComponent {
	readonly appearance = input<AppButtonAppearance>('filled');
	readonly size = input<AppButtonSize>('default');
	readonly type = input<'button' | 'submit' | 'reset'>('button');
	readonly disabled = input<boolean>(false);
	readonly ariaLabel = input<string>();
	readonly ariaExpanded = input<boolean>();
	/** Extra classes for the inner button — `class` on the host forwards here. */
	readonly classes = input<string>('', { alias: 'class' });
	/** Leading / trailing Material icon ligature names, e.g. `search`. */
	readonly icon = input<string>('');
	readonly iconEnd = input<string>('');
	readonly clicked = output<MouseEvent>();

	/** `destructive` renders as a filled button carrying the destructive class. */
	protected readonly matAppearance = computed<MatButtonAppearance>(() =>
		this.appearance() === 'destructive' ? 'filled' : (this.appearance() as MatButtonAppearance),
	);
	protected readonly isDestructive = computed(() => this.appearance() === 'destructive');
	/** Size class merged with any caller-supplied classes, applied to the button. */
	protected readonly buttonClass = computed(() => `size-${this.size()} ${this.classes()}`.trim());
}
