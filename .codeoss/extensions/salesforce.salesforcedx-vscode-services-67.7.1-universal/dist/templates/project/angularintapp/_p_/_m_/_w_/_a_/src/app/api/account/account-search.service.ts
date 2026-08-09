/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { Injectable, inject } from "@angular/core";
// DataClient is provided by the base-angular-app. Consumed via the
// `__inherit__` stub one level up (app/api/account/ -> app/api/); post-compose
// patches-cli strips the prefix so it resolves to the seeded base file at
// app/api/data-client.service.ts.
import { DataClient } from "../data-client.service";
// Query constants are owned by this feature (sibling files) so object-search
// is self-contained — no external GraphQL dependency.
import { SEARCH_ACCOUNTS } from "./searchAccounts";
import { GET_ACCOUNT_DETAIL } from "./getAccountDetail";
import { DISTINCT_ACCOUNT_INDUSTRIES } from "./distinctAccountIndustries";
import { DISTINCT_ACCOUNT_TYPES } from "./distinctAccountTypes";

// ---------------------------------------------------------------------------
// Local response shape types. Codegen is PARKED for the Angular port; when it
// lands, replace these hand-written interfaces with the generated ones from
// graphql-operations-types (see the React reference for the equivalent).
// ---------------------------------------------------------------------------

/** A Salesforce GraphQL scalar field: `{ value, displayValue }`. */
export interface UiScalarField<T = unknown> {
	value?: T | null;
	displayValue?: string | null;
}

/** An Account node with the fields the search + detail queries request. */
export interface AccountNode {
	Id: string;
	Name?: UiScalarField<string> | null;
	Industry?: UiScalarField<string> | null;
	Type?: UiScalarField<string> | null;
	Phone?: UiScalarField<string> | null;
	Owner?: { Name?: UiScalarField<string> | null } | null;
	AnnualRevenue?: UiScalarField<number> | null;
	// Detail-only fields (undefined in list responses).
	Fax?: UiScalarField<string> | null;
	Parent?: { Name?: UiScalarField<string> | null } | null;
	Website?: UiScalarField<string> | null;
	NumberOfEmployees?: UiScalarField<number> | null;
	Description?: UiScalarField<string> | null;
	BillingStreet?: UiScalarField<string> | null;
	BillingCity?: UiScalarField<string> | null;
	BillingState?: UiScalarField<string> | null;
	BillingPostalCode?: UiScalarField<string> | null;
	BillingCountry?: UiScalarField<string> | null;
	ShippingStreet?: UiScalarField<string> | null;
	ShippingCity?: UiScalarField<string> | null;
	ShippingState?: UiScalarField<string> | null;
	ShippingPostalCode?: UiScalarField<string> | null;
	ShippingCountry?: UiScalarField<string> | null;
	CreatedBy?: { Name?: UiScalarField<string> | null } | null;
	CreatedDate?: UiScalarField<string> | null;
	LastModifiedBy?: { Name?: UiScalarField<string> | null } | null;
	LastModifiedDate?: UiScalarField<string> | null;
}

/** GraphQL page-info block returned by the connection response. */
export interface AccountPageInfo {
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	endCursor?: string | null;
	startCursor?: string | null;
}

/** The `uiapi.query.Account` connection returned by the search query. */
export interface AccountSearchResult {
	edges: Array<{ node: AccountNode } | null> | null;
	pageInfo: AccountPageInfo;
	totalCount?: number;
}

/** Wire shape for the `search` query. */
interface SearchAccountsData {
	uiapi: { query: { Account: AccountSearchResult | null } };
}

/** Wire shape for the `getAccountDetail` query. */
interface GetAccountDetailData {
	uiapi: {
		query: {
			Account: { edges: Array<{ node: AccountNode } | null> | null } | null;
		};
	};
}

/** Wire shape for the distinct-value aggregate queries. */
interface DistinctAccountData {
	uiapi: {
		aggregate: {
			Account: {
				edges: Array<{
					node: {
						aggregate?: Record<
							string,
							{
								value?: string | null;
								displayValue?: string | null;
								label?: string | null;
							} | null
						> | null;
					};
				} | null> | null;
			} | null;
		};
	};
}

/** Picklist option shape shared with filter components. */
export interface PicklistOption {
	value: string;
	label: string;
}

/** Search args mirroring the React `AccountSearchOptions`. */
export interface AccountSearchArgs {
	where?: unknown;
	orderBy?: unknown;
	first?: number;
	after?: string;
}

/**
 * Angular account-search data service.
 *
 * Wraps the base-app's `DataClient` with typed methods per feature query
 * (search, detail, and the two distinct-value aggregates that populate the
 * Industry / Type filter options). Provided in root; the service is stateless
 * (all state lives in `ObjectSearchStateService` per-page).
 *
 * Mirrors the React `accountSearchService` module — the shape of the returned
 * data is identical so the templates can be a straight JSX-to-Angular port.
 */
@Injectable({ providedIn: "root" })
export class AccountSearchService {
	private readonly client = inject(DataClient);

	/** Runs the search query and returns the `Account` connection. */
	async searchAccounts(args: AccountSearchArgs = {}): Promise<AccountSearchResult> {
		const { where, orderBy, first = 20, after } = args;
		const data = await this.client.execute<SearchAccountsData, AccountSearchArgs>(SEARCH_ACCOUNTS, {
			where,
			orderBy,
			first,
			after,
		});
		const account = data.uiapi.query.Account;
		if (!account) {
			throw new Error("No Account data returned");
		}
		return account;
	}

	/** Fetches a single Account by Id; returns `null` if not found. */
	async getAccountDetail(id: string): Promise<AccountNode | null> {
		const data = await this.client.execute<GetAccountDetailData, { id: string }>(
			GET_ACCOUNT_DETAIL,
			{ id },
		);
		return data.uiapi.query.Account?.edges?.[0]?.node ?? null;
	}

	/** Distinct `Industry` values for the picklist filter. */
	async fetchDistinctIndustries(): Promise<PicklistOption[]> {
		return this.fetchDistinctValues("Industry", DISTINCT_ACCOUNT_INDUSTRIES);
	}

	/** Distinct `Type` values for the multipicklist filter. */
	async fetchDistinctTypes(): Promise<PicklistOption[]> {
		return this.fetchDistinctValues("Type", DISTINCT_ACCOUNT_TYPES);
	}

	/**
	 * Shared distinct-value shape parser. Mirrors the React
	 * `fetchDistinctValues` in `objectSearchService.ts`: pulls
	 * `uiapi.aggregate.Account.edges[].node.aggregate[fieldName]` and derives a
	 * `{ value, label }` option, preferring `label` -> `displayValue` -> `value`
	 * as the display string.
	 */
	private async fetchDistinctValues(fieldName: string, query: string): Promise<PicklistOption[]> {
		const data = await this.client.execute<DistinctAccountData>(query);
		const edges = data.uiapi.aggregate.Account?.edges ?? [];
		const options: PicklistOption[] = [];
		for (const edge of edges) {
			const field = edge?.node.aggregate?.[fieldName];
			const value = field?.value;
			if (!value) continue;
			options.push({ value, label: field.label ?? field.displayValue ?? value });
		}
		return options;
	}
}
