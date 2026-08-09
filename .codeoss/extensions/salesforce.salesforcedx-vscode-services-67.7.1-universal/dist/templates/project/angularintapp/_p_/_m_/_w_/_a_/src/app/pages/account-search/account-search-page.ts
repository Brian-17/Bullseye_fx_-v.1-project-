/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
// Base-app UI wrappers, inherited (not recreated) by this feature. Post-compose
// they land at uiBundles/<target>/src/app/components/ui/..., three levels up from this
// page folder (app/features/account-search/ -> app/components/ui/).
import { AlertComponent } from "../../components/ui/alert/alert";
import { CollapsibleComponent } from "../../components/ui/collapsible/collapsible";
import { SkeletonComponent } from "../../components/ui/skeleton/skeleton";
// Object-search feature building blocks (Waves 1-2), two levels up.
import { ObjectBreadcrumbComponent } from "../../features/object-search/breadcrumb/breadcrumb";
import { SortControlComponent } from "../../features/object-search/sort-control/sort-control";
import { ActiveFiltersComponent } from "../../features/object-search/filters/active-filters";
import { PaginationControlsComponent } from "../../features/object-search/pagination/pagination";
import { SearchFilterComponent } from "../../features/object-search/filters/search-filter";
import { TextFilterComponent } from "../../features/object-search/filters/text-filter";
import { SelectFilterComponent } from "../../features/object-search/filters/select-filter";
import { MultiSelectFilterComponent } from "../../features/object-search/filters/multi-select-filter";
import { NumericRangeFilterComponent } from "../../features/object-search/filters/numeric-range-filter";
import { DateFilterComponent } from "../../features/object-search/filters/date-filter";
import { DateRangeFilterComponent } from "../../features/object-search/filters/date-range-filter";
import {
	ObjectSearchStateService,
	type PaginationConfig,
} from "../../features/object-search/object-search-state.service";
import { createAsyncData } from "../../utils/async-data";
import { fieldValue } from "../../features/object-search/utils/field-utils";
import type { FilterFieldConfig } from "../../features/object-search/utils/filter-utils";
import type { SortFieldConfig } from "../../features/object-search/utils/sort-utils";
import { AccountSearchService, type AccountNode } from "../../api/account/account-search.service";

/** Cursor-pagination config for the account search (mirrors the React reference). */
const PAGINATION_CONFIG: PaginationConfig = {
	defaultPageSize: 7,
	validPageSizes: [7, 14, 28, 42],
};

/**
 * Filter field configs — the single source of truth for URL (de)serialization
 * and GraphQL `where` building. The picklist option lists for Industry / Type
 * are filled in at runtime (see the component's computed configs) from the
 * distinct-value aggregate queries.
 */
const FILTER_CONFIGS: FilterFieldConfig[] = [
	{
		field: "search",
		label: "Search",
		type: "search",
		searchFields: ["Name", "Phone", "Industry"],
		placeholder: "Search by name, phone, or industry...",
	},
	{ field: "Name", label: "Account Name", type: "text", placeholder: "Search by name..." },
	{ field: "Industry", label: "Industry", type: "picklist" },
	{ field: "Type", label: "Type", type: "multipicklist" },
	{ field: "AnnualRevenue", label: "Annual Revenue", type: "numeric" },
	{ field: "CreatedDate", label: "Created Date", type: "datetime", disableFuture: true },
	{
		field: "LastModifiedDate",
		label: "Last Modified Date",
		type: "datetimerange",
		disableFuture: true,
	},
];

/** Sortable fields exposed by the sort control (mirrors the React reference). */
const ACCOUNT_SORT_CONFIGS: SortFieldConfig[] = [
	{ field: "Name", label: "Name" },
	{ field: "AnnualRevenue", label: "Annual Revenue" },
	{ field: "Industry", label: "Industry" },
	{ field: "CreatedDate", label: "Created Date" },
];

/**
 * Account search / list page. The Angular analogue of the React `AccountSearch`
 * example page: a sidebar filter panel (Card + Collapsible) plus a main results
 * area with sort control, active-filter chips, a results list, and cursor
 * pagination.
 *
 * State lives in a page-scoped {@link ObjectSearchStateService} (provided here,
 * NOT in root) so each search page owns its own filters / sort / cursor stack.
 * The filter components projected into the sidebar inject that same instance.
 *
 * Data flows through {@link createAsyncData}: whenever the derived query args
 * (where / orderBy / pageSize / afterCursor) change, the search re-runs with
 * latest-wins semantics.
 */
@Component({
	selector: "app-account-search-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ObjectSearchStateService],
	imports: [
		RouterLink,
		AlertComponent,
		CollapsibleComponent,
		SkeletonComponent,
		ObjectBreadcrumbComponent,
		SortControlComponent,
		ActiveFiltersComponent,
		PaginationControlsComponent,
		SearchFilterComponent,
		TextFilterComponent,
		SelectFilterComponent,
		MultiSelectFilterComponent,
		NumericRangeFilterComponent,
		DateFilterComponent,
		DateRangeFilterComponent,
	],
	templateUrl: "./account-search-page.html",
})
export class AccountSearchPageComponent {
	private readonly service = inject(AccountSearchService);
	private readonly state = inject(ObjectSearchStateService);

	/** Sortable field configs surfaced to the sort control. */
	protected readonly sortConfigs = ACCOUNT_SORT_CONFIGS;
	/** Allowed page sizes forwarded to the pagination controls. */
	protected readonly pageSizeOptions = PAGINATION_CONFIG.validPageSizes;

	/** Collapsible open state for the sidebar filter panel. */
	protected readonly filtersOpen = signal<boolean>(true);

	/** Derived, API-ready `where` / `orderBy` signals from the shared state. */
	private readonly query = this.state.init<unknown, unknown>(FILTER_CONFIGS, PAGINATION_CONFIG);

	/** Live page-size / cursor signals from the shared state. */
	protected readonly pageSize = this.state.pageSize;
	protected readonly hasPreviousPage = this.state.hasPreviousPage;

	// -- Distinct-value option loads (Industry / Type filters) -----------------
	private readonly industries = createAsyncData(signal(0), () =>
		this.service.fetchDistinctIndustries(),
	);
	private readonly types = createAsyncData(signal(0), () => this.service.fetchDistinctTypes());

	// -- Per-filter configs (options merged in for the picklist filters) -------
	protected readonly searchConfig = FILTER_CONFIGS[0];
	protected readonly nameConfig = FILTER_CONFIGS[1];
	protected readonly revenueConfig = FILTER_CONFIGS[4];
	protected readonly createdConfig = FILTER_CONFIGS[5];
	protected readonly lastModifiedConfig = FILTER_CONFIGS[6];
	protected readonly industryConfig = computed<FilterFieldConfig>(() => ({
		...FILTER_CONFIGS[2],
		options: this.industries.data() ?? [],
	}));
	protected readonly typeConfig = computed<FilterFieldConfig>(() => ({
		...FILTER_CONFIGS[3],
		options: this.types.data() ?? [],
	}));

	// -- Search results --------------------------------------------------------
	private readonly searchArgs = computed(() => ({
		where: this.query.where(),
		orderBy: this.query.orderBy(),
		first: this.state.pageSize(),
		after: this.state.afterCursor(),
	}));
	private readonly result = createAsyncData(this.searchArgs, (args) =>
		this.service.searchAccounts(args),
	);

	protected readonly loading = this.result.loading;
	protected readonly error = this.result.error;

	private readonly pageInfo = computed(() => this.result.data()?.pageInfo);
	protected readonly totalCount = computed(() => this.result.data()?.totalCount);
	protected readonly hasNextPage = computed(() => this.pageInfo()?.hasNextPage ?? false);
	protected readonly endCursor = computed(() => this.pageInfo()?.endCursor ?? undefined);

	/** Non-null account nodes from the current page's edges. */
	protected readonly nodes = computed<AccountNode[]>(() => {
		const edges = this.result.data()?.edges ?? [];
		const out: AccountNode[] = [];
		for (const edge of edges) {
			if (edge?.node) out.push(edge.node);
		}
		return out;
	});

	/** Pagination controls (and the results list) are inert while fetching/errored. */
	protected readonly controlsDisabled = computed(() => this.loading() || !!this.error());

	/** Placeholder rows for the loading skeleton — one per requested page size. */
	protected readonly skeletonRows = computed(() =>
		Array.from({ length: this.pageSize() }, (_, i) => i),
	);

	/** Result-count copy above the list, matching the React reference wording. */
	protected readonly resultCountLabel = computed(() => {
		const total = this.totalCount();
		const shown = this.nodes().length;
		if (total != null && (this.hasNextPage() || this.hasPreviousPage())) {
			return `${total} account${total !== 1 ? "s" : ""} found`;
		}
		return `Showing ${shown} account${shown !== 1 ? "s" : ""}`;
	});

	/** Display helpers for the results list (mirrors `fieldValue` in the template). */
	protected name(node: AccountNode): string {
		return fieldValue(node.Name) ?? "—";
	}

	protected secondaryLine(node: AccountNode): string {
		return [fieldValue(node.Industry), fieldValue(node.Type)].filter(Boolean).join(" · ") || "—";
	}

	protected phone(node: AccountNode): string {
		return fieldValue(node.Phone) ?? "";
	}

	protected ownerName(node: AccountNode): string {
		return fieldValue(node.Owner?.Name) ?? "";
	}
}
