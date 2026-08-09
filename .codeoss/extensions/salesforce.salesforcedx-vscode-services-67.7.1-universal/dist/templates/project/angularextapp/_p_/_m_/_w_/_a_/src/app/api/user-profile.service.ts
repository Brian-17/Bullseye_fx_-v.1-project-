/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { Injectable, inject } from "@angular/core";
// DataClient is provided by the base-angular-app. Consumed via the
// `__inherit__` stub in this same folder (app/api/); post-compose patches-cli
// strips the prefix so it resolves to the seeded base file at
// app/api/data-client.service.ts.
import { DataClient } from "./data-client.service";
import { flattenGraphQLRecord } from "../features/authentication/utils/helpers";

// ---------------------------------------------------------------------------
// Hand-written GraphQL query/mutation strings + wire types. Codegen is PARKED
// for the Angular port (same decision as object-search). The field selection,
// query/mutation shape, and variable structure mirror the React
// `userProfileApi.ts` byte-for-byte so behavior is identical.
// ---------------------------------------------------------------------------

const USER_PROFILE_FIELDS_FULL = `
    Id
    FirstName @optional { value }
    LastName @optional { value }
    Email @optional { value }
    Phone @optional { value }
    Street @optional { value }
    City @optional { value }
    State @optional { value }
    PostalCode @optional { value }
    Country @optional { value }`;

const USER_CONTACT_FIELDS = `
    Id
    ContactId @optional { value }`;

function getUserProfileQuery(fields: string): string {
	return `
    query GetUserProfile($userId: ID) {
        uiapi {
            query {
                User(where: { Id: { eq: $userId } }) {
                    edges {
                        node {${fields}}
                    }
                }
            }
        }
    }`;
}

function getUserProfileMutation(fields: string): string {
	return `
    mutation UpdateUserProfile($input: UserUpdateInput!) {
      uiapi {
        UserUpdate(input: $input) {
          Record {${fields}}
        }
      }
    }`;
}

/** Wire shape for the GetUserProfile query. */
interface GetUserProfileData {
	uiapi: {
		query: {
			User: { edges: Array<{ node: Record<string, unknown> } | null> | null } | null;
		};
	};
}

/** Wire shape for the UpdateUserProfile mutation. */
interface UpdateUserProfileData {
	uiapi: {
		UserUpdate: { Record: Record<string, unknown> | null } | null;
	};
}

/**
 * Extensible user-profile fetching and updating via UI API GraphQL — the
 * Angular port of the React `userProfileApi.ts` module.
 *
 * Uses the base app's `DataClient` (which centralizes GraphQL error handling
 * and routes mutations vs queries), matching the object-search feature's
 * data-access idiom. Responses are flattened via `flattenGraphQLRecord` for
 * straightforward form binding.
 */
@Injectable({ providedIn: "root" })
export class UserProfileService {
	private readonly client = inject(DataClient);

	/**
	 * Fetches the user profile via GraphQL and returns a flattened record.
	 * @param userId - The Salesforce User Id.
	 * @param fields - GraphQL field selection (defaults to the full profile).
	 */
	async fetchUserProfile<T>(userId: string, fields: string = USER_PROFILE_FIELDS_FULL): Promise<T> {
		const data = await this.client.execute<GetUserProfileData, { userId: string }>(
			getUserProfileQuery(fields),
			{ userId },
		);
		return flattenGraphQLRecord<T>(data.uiapi?.query?.User?.edges?.[0]?.node);
	}

	/**
	 * Fetches the user's associated contact record ID via GraphQL and returns a
	 * flattened record.
	 * @param userId - The Salesforce User Id.
	 */
	async fetchUserContact<T>(userId: string): Promise<T> {
		return this.fetchUserProfile<T>(userId, USER_CONTACT_FIELDS);
	}

	/**
	 * Updates the user profile via GraphQL and returns the flattened updated record.
	 * @param userId - The Salesforce User Id.
	 * @param values - The field values to update.
	 */
	async updateUserProfile<T>(userId: string, values: Record<string, unknown>): Promise<T> {
		const data = await this.client.execute<UpdateUserProfileData, { input: unknown }>(
			getUserProfileMutation(USER_PROFILE_FIELDS_FULL),
			{ input: { Id: userId, User: { ...values } } },
		);
		return flattenGraphQLRecord<T>(data.uiapi?.UserUpdate?.Record);
	}
}
