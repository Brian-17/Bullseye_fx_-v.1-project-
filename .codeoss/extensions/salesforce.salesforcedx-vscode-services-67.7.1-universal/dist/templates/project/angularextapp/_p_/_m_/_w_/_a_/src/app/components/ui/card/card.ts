/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
	MatCard,
	MatCardActions,
	MatCardContent,
	MatCardHeader,
	MatCardSubtitle,
	MatCardTitle,
} from '@angular/material/card';

/** Card container density. */
export type AppCardSize = 'default' | 'sm';

/**
 * Thin wrapper over `mat-card`. Preserves the `app-card` / `app-card-*` slot API
 * while Material drives the visual. `size="sm"` maps to a compact-padding class.
 */
@Component({
	selector: 'app-card',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatCard],
	template:
		'<mat-card appearance="outlined" [class]="classes()" [class.app-card-sm]="size() === \'sm\'"><ng-content /></mat-card>',
	styleUrl: './card.scss',
})
export class CardComponent {
	readonly size = input<AppCardSize>('default');
	/** Extra classes forwarded to the inner `mat-card` (host `class` lands here). */
	readonly classes = input<string>('', { alias: 'class' });
}

/**
 * Header slot — wraps `mat-card-header` and recreates its title/subtitle stack
 * so the slots project by element selector (Material's static
 * `[mat-card-title]` projection can't see the runtime attribute across this
 * boundary, and would otherwise render title + subtitle side by side).
 */
@Component({
	selector: 'app-card-header',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatCardHeader],
	template: `<mat-card-header [class]="classes()">
		<ng-content select="[mat-card-avatar]" />
		<div class="app-card-header-text">
			<ng-content select="app-card-title" />
			<ng-content select="app-card-description" />
		</div>
		<ng-content />
	</mat-card-header>`,
	styles: '.app-card-header-text { display: flex; flex-direction: column; gap: 0.25rem; }',
})
export class CardHeaderComponent {
	/** Extra classes forwarded to the inner `mat-card-header`. */
	readonly classes = input<string>('', { alias: 'class' });
}

/** Title slot — Material's `MatCardTitle` styling. */
@Component({
	selector: 'app-card-title',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [MatCardTitle],
	template: '<ng-content />',
})
export class CardTitleComponent {}

/** Description slot — Material's `mat-card-subtitle` styling. */
@Component({
	selector: 'app-card-description',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [MatCardSubtitle],
	template: '<ng-content />',
})
export class CardDescriptionComponent {}

/** Action slot — pinned to the trailing edge of `app-card-header`. */
@Component({
	selector: 'app-card-action',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { style: 'margin-inline-start: auto; align-self: flex-start;' },
	template: '<ng-content />',
})
export class CardActionComponent {}

/** Body slot — Material's `mat-card-content`. */
@Component({
	selector: 'app-card-content',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [MatCardContent],
	template: '<ng-content />',
})
export class CardContentComponent {}

/**
 * Footer slot — Material's `mat-card-actions` (a flex-row action bar).
 * Material ships no inter-button spacing, so `:host` (the actions element)
 * sets a `gap`.
 */
@Component({
	selector: 'app-card-footer',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [MatCardActions],
	styles: ':host { gap: 0.5rem; }',
	template: '<ng-content />',
})
export class CardFooterComponent {}
