/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginator, type PageEvent } from '@angular/material/paginator';

/**
 * Thin wrapper over Material's `mat-paginator`. Presentation only — the host
 * decides what each page change means by listening to `(page)`.
 */
@Component({
	selector: 'app-paginator',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatPaginator],
	templateUrl: './paginator.html',
})
export class PaginatorComponent {
	/** Total item count; Material derives the page count as `ceil(length / pageSize)`. */
	readonly length = input<number>(0);
	/** Zero-based index of the current page. */
	readonly pageIndex = input<number>(0);
	/** Items shown per page. */
	readonly pageSize = input<number>(10);
	/** Selectable page sizes; omit/empty to hide the size selector. */
	readonly pageSizeOptions = input<readonly number[]>([]);
	/** Disable navigation buttons and the size select (e.g. while loading). */
	readonly disabled = input(false, { transform: booleanAttribute });
	/** Hide the "Items per page" selector. */
	readonly hidePageSize = input(false, { transform: booleanAttribute });
	/** Show the first / last page jump buttons. */
	readonly showFirstLastButtons = input(false, { transform: booleanAttribute });

	/** Emitted when the user changes page or page size. */
	readonly page = output<PageEvent>();
}
