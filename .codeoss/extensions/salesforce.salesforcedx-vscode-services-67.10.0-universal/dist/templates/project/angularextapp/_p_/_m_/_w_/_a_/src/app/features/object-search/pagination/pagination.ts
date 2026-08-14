/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import type { PageEvent } from "@angular/material/paginator";
import { PaginatorComponent } from "../../../components/ui/paginator/paginator";
import { ObjectSearchStateService } from "../object-search-state.service";

/**
 * Cursor-pagination bridge. Feeds the shared cursor state into the presentational
 * {@link PaginatorComponent} (`app-paginator`) and translates its offset-style
 * `(page)` event back into the cursor walk the state service understands.
 *
 * State comes from the shared {@link ObjectSearchStateService} (`pageIndex`,
 * `pageSize`); the hosting page supplies the cursor-derived inputs
 * (`totalCount`, `hasNextPage`, `endCursor`) after each fetch. A next-page step
 * needs the current `endCursor`; a previous step and page-size changes are
 * handled entirely by the state service's cursor stack.
 */
@Component({
	selector: "app-pagination-controls",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PaginatorComponent],
	templateUrl: "./pagination.html",
})
export class PaginationControlsComponent {
	/** Total row count from the latest fetch; drives the paginator's range label. */
	readonly totalCount = input<number | undefined>(undefined);
	/** Whether the API reports another page after the current one. */
	readonly hasNextPage = input<boolean>(false);
	/** `endCursor` from the latest page-info; forwarded to `goToNextPage`. */
	readonly endCursor = input<string | undefined>(undefined);
	/** Allowed page-size choices. */
	readonly pageSizeOptions = input.required<readonly number[]>();
	/** Disable navigation and the size select (e.g. while loading). */
	readonly disabled = input<boolean>(false);

	private readonly state = inject(ObjectSearchStateService);
	protected readonly pageIndex = this.state.pageIndex;
	protected readonly pageSize = this.state.pageSize;

	/**
	 * Route Material's offset-style page event onto the cursor model: a page-size
	 * change resets pagination; a forward step walks the `endCursor`; a backward
	 * step pops the cursor stack.
	 */
	protected onPage(event: PageEvent): void {
		if (event.pageSize !== this.pageSize()) {
			this.state.setPageSize(event.pageSize);
			return;
		}
		if (event.pageIndex > this.pageIndex()) {
			const cursor = this.endCursor();
			if (cursor && this.hasNextPage()) this.state.goToNextPage(cursor);
		} else if (event.pageIndex < this.pageIndex()) {
			this.state.goToPreviousPage();
		}
	}
}
