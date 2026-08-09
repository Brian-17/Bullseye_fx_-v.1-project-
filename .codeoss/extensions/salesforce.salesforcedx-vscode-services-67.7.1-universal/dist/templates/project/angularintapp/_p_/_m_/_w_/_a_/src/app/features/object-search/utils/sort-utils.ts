/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */

// NOTE: The React reference imports `ResultOrder` / `NullOrder` from generated
// GraphQL types (graphql-operations-types.ts). Codegen is parked for the
// Angular port, so the enum string values are inlined here. When codegen lands,
// swap these constants for the generated enums.
/** GraphQL `ResultOrder` values. */
const RESULT_ORDER = { asc: "ASC", desc: "DESC" } as const;
/** GraphQL `NullOrder` values. */
const NULL_ORDER = { first: "FIRST", last: "LAST" } as const;

export interface SortFieldConfig<TFieldName extends string = string> {
	field: TFieldName;
	label: string;
}

export interface SortState<TFieldName extends string = string> {
	field: TFieldName;
	direction: "ASC" | "DESC";
}

/**
 * Converts a {@link SortState} into a GraphQL order-by object.
 *
 * @typeParam TOrderBy - The GraphQL order-by input type (e.g. `Account_OrderBy`).
 * @param sort - The current sort state from the UI, or `null` if no sort is applied.
 * @returns An order-by object for the query's `orderBy` variable, or `undefined`
 *          when no sort is active (defers to the API's default ordering).
 *
 * @example
 * buildOrderBy({ field: 'Name', direction: 'ASC' })
 * // => { Name: { order: 'ASC', nulls: 'LAST' } }
 */
export function buildOrderBy<TOrderBy>(sort: SortState | null): TOrderBy | undefined {
	if (!sort) return undefined;
	return {
		[sort.field]: {
			order: sort.direction === "ASC" ? RESULT_ORDER.asc : RESULT_ORDER.desc,
			nulls: NULL_ORDER.last,
		},
	} as TOrderBy;
}
