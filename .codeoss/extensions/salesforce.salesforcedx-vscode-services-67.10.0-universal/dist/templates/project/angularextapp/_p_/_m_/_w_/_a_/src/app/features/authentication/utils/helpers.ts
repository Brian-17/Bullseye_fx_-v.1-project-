/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */

/**
 * Error thrown when the API returns a non-OK response with structured error
 * messages. The `errors` array contains user-facing messages that are safe to
 * display — backend Apex classes guarantee that system exceptions are never
 * exposed. Direct port of the React `ApiError`.
 */
export class ApiError extends Error {
	readonly errors: string[];
	constructor(errors: string[]) {
		super(errors[0]);
		this.name = "ApiError";
		this.errors = errors;
	}
}

/**
 * Helper to parse the fetch Response. Handles the distinction between success
 * (JSON) and failure (throwing Error). Ported from the React `handleApiResponse`.
 */
export async function handleApiResponse<T = unknown>(response: Response): Promise<T> {
	// Robustness: Handle 204 No Content gracefully
	if (response.status === 204) {
		return {} as T;
	}

	let data: { errors?: string[] } | null = null;

	const contentType = response.headers.get("content-type");
	if (contentType?.includes("application/json")) {
		data = (await response.json()) as { errors?: string[] };
	} else {
		// If Salesforce returns HTML (e.g. standard error page), consume the text
		// to avoid parsing errors.
		await response.text();
	}

	if (!response.ok) {
		console.error("API request failed", data);
		if (data?.errors?.length) {
			throw new ApiError(data.errors);
		}
		throw new Error("An unexpected error occurred");
	}

	return data as T;
}

/** UI API Record response structure. */
export type RecordResponse = {
	fields: Record<string, { value: string }>;
};

/**
 * GraphQL can return a complex nested structure. This helper flattens it to a
 * simple object for easier form binding. Ported from the React
 * `flattenGraphQLRecord`.
 *
 * @param data - Extracted payload from the GraphQL response.
 * @param fallbackError - Fallback error message if data is null/undefined or not an object.
 * @throws {Error} If data is not valid.
 * @returns Flattened object with values mapped directly to the fields.
 */
export function flattenGraphQLRecord<T>(
	data: unknown,
	fallbackError = "An unknown error occurred",
): T {
	if (!data || typeof data !== "object") {
		throw new Error(fallbackError);
	}

	return Object.fromEntries(
		Object.entries(data as Record<string, unknown>).map(([key, field]) => [
			key,
			field !== null && typeof field === "object" && "value" in field
				? (field as { value: unknown }).value
				: (field ?? null),
		]),
	) as T;
}
