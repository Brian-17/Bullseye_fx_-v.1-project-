/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
// Base-app UI wrappers, inherited (not recreated) by this feature. Post-compose
// they land at uiBundles/<target>/src/app/components/ui/..., three levels up from this
// page folder (app/features/account-search/ -> app/components/ui/).
import { AlertComponent } from "../../components/ui/alert/alert";
import { ButtonComponent } from "../../components/ui/button/button";
import { CardComponent, CardContentComponent } from "../../components/ui/card/card";
import { CollapsibleComponent } from "../../components/ui/collapsible/collapsible";
import { SeparatorComponent } from "../../components/ui/separator/separator";
import { SkeletonComponent } from "../../components/ui/skeleton/skeleton";
// Object-search feature building blocks (Waves 1-2), two levels up.
import { ObjectBreadcrumbComponent } from "../../features/object-search/breadcrumb/breadcrumb";
import { createAsyncData } from "../../utils/async-data";
import {
	fieldValue,
	getAddressFieldLines,
	formatDateTimeField,
} from "../../features/object-search/utils/field-utils";
import { AccountSearchService } from "../../api/account/account-search.service";

/** `Intl` options for the created / last-modified timestamps (matches React). */
const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
	dateStyle: "medium",
	timeStyle: "short",
};

/** A `{ label, value }` pair rendered in a field grid. */
interface Field {
	label: string;
	value: string | null;
	/** `true` renders the value as a `tel:` link (Phone / Fax). */
	telephone?: boolean;
}

/**
 * Account detail page. The Angular analogue of the React
 * `AccountObjectDetailPage`: a breadcrumb plus a card of collapsible sections
 * (top fields, Additional / Address / System information), with loading,
 * error, and not-found states.
 *
 * The record id comes from the `:recordId` route param (reactively, so a
 * client-side nav between two detail routes refetches). Data flows through
 * {@link createAsyncData} for latest-wins fetching.
 */
@Component({
	selector: "app-account-detail-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AlertComponent,
		ButtonComponent,
		CardComponent,
		CardContentComponent,
		CollapsibleComponent,
		SeparatorComponent,
		SkeletonComponent,
		ObjectBreadcrumbComponent,
	],
	templateUrl: "./account-detail-page.html",
	styleUrl: "./account-detail-page.scss",
})
export class AccountDetailPageComponent {
	private readonly service = inject(AccountSearchService);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);

	/** Reactive `:recordId` param — drives (and re-drives) the fetch. */
	private readonly recordId = toSignal(
		this.route.paramMap.pipe(map((p) => p.get("recordId") ?? "")),
		{ initialValue: this.route.snapshot.paramMap.get("recordId") ?? "" },
	);

	private readonly result = createAsyncData(this.recordId, (id) =>
		this.service.getAccountDetail(id),
	);

	protected readonly account = this.result.data;
	protected readonly loading = this.result.loading;
	protected readonly error = this.result.error;
	/** True once a resolved fetch returned no record (distinct from loading). */
	protected readonly notFound = computed(() => !this.loading() && !this.error() && !this.account());

	/** Per-section collapsible open state (all default open, matching React). */
	protected readonly additionalOpen = signal<boolean>(true);
	protected readonly addressOpen = signal<boolean>(true);
	protected readonly systemOpen = signal<boolean>(true);

	/** Placeholder rows for skeleton field grids. */
	protected readonly skeletonRows = [0, 1, 2];

	// -- Breadcrumb leaf label -------------------------------------------------
	protected readonly recordName = computed<string | undefined>(() => {
		const a = this.account();
		if (a) return fieldValue(a.Name) ?? "";
		if (this.error()) return "Error";
		if (this.loading()) return undefined;
		return "Not Found";
	});

	// -- Header ----------------------------------------------------------------
	protected readonly title = computed(() => fieldValue(this.account()?.Name ?? null) ?? "");

	// -- Top field rows --------------------------------------------------------
	protected readonly topRows = computed<Field[][]>(() => {
		const a = this.account();
		if (!a) return [];
		return [
			[
				{ label: "Account Owner", value: fieldValue(a.Owner?.Name) },
				{ label: "Phone", value: fieldValue(a.Phone), telephone: true },
			],
			[
				{ label: "Account Name", value: fieldValue(a.Name) },
				{ label: "Fax", value: fieldValue(a.Fax), telephone: true },
			],
			[
				{ label: "Parent Account", value: fieldValue(a.Parent?.Name) },
				{ label: "Website", value: fieldValue(a.Website) },
			],
		];
	});

	// -- Additional Information ------------------------------------------------
	protected readonly additionalRows = computed<Field[][]>(() => {
		const a = this.account();
		if (!a) return [];
		return [
			[
				{ label: "Type", value: fieldValue(a.Type) },
				{ label: "Employees", value: fieldValue(a.NumberOfEmployees) },
			],
			[
				{ label: "Industry", value: fieldValue(a.Industry) },
				{ label: "Annual Revenue", value: fieldValue(a.AnnualRevenue) },
			],
		];
	});
	protected readonly description = computed(() => fieldValue(this.account()?.Description ?? null));

	// -- Address Information ---------------------------------------------------
	protected readonly billingAddress = computed<string[] | null>(() => {
		const a = this.account();
		if (!a) return null;
		return getAddressFieldLines({
			street: fieldValue(a.BillingStreet),
			city: fieldValue(a.BillingCity),
			state: fieldValue(a.BillingState),
			postalCode: fieldValue(a.BillingPostalCode),
			country: fieldValue(a.BillingCountry),
		});
	});
	protected readonly shippingAddress = computed<string[] | null>(() => {
		const a = this.account();
		if (!a) return null;
		return getAddressFieldLines({
			street: fieldValue(a.ShippingStreet),
			city: fieldValue(a.ShippingCity),
			state: fieldValue(a.ShippingState),
			postalCode: fieldValue(a.ShippingPostalCode),
			country: fieldValue(a.ShippingCountry),
		});
	});

	// -- System Information ----------------------------------------------------
	protected readonly createdBy = computed(() =>
		this.joinNameAndDate(this.account()?.CreatedBy?.Name, this.account()?.CreatedDate),
	);
	protected readonly lastModifiedBy = computed(() =>
		this.joinNameAndDate(this.account()?.LastModifiedBy?.Name, this.account()?.LastModifiedDate),
	);

	private joinNameAndDate(
		name: { value?: unknown; displayValue?: string | null } | null | undefined,
		date: { value?: unknown; displayValue?: string | null } | null | undefined,
	): string | null {
		const formatted = formatDateTimeField(fieldValue(date ?? null), undefined, DATE_TIME_OPTIONS);
		return [fieldValue(name ?? null), formatted].filter(Boolean).join(" ") || null;
	}

	/** Navigate back to the previous view (mirrors the React `navigate(-1)`). */
	protected goBack(): void {
		void this.router.navigate(["/accounts"]);
	}

	/** Full page reload retry, matching the React "Retry" affordance. */
	protected reload(): void {
		window.location.reload();
	}
}
