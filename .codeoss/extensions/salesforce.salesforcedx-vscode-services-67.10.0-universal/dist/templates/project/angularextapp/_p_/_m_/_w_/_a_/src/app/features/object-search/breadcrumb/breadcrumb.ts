/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SkeletonComponent } from "../../../components/ui/skeleton/skeleton";

/**
 * Object-search breadcrumb — Home > Records list > (optional) Record name.
 *
 * Mirrors the React `ObjectBreadcrumb`. Renders the list-only crumb by default
 * and switches to the detail-view crumb (with record name + skeleton fallback)
 * as soon as `loading` or `recordName` is set. Uses Angular `routerLink` where
 * the React version uses `react-router`'s `Link`.
 */
@Component({
	selector: "app-object-breadcrumb",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, SkeletonComponent],
	templateUrl: "./breadcrumb.html",
})
export class ObjectBreadcrumbComponent {
	/** Router path for the object list view (e.g. `/accounts`). */
	readonly listPath = input.required<string>();
	/** Label for the list crumb (e.g. `Accounts`). */
	readonly listLabel = input.required<string>();
	/** Record name for the detail-view leaf crumb; omit for list-only view. */
	readonly recordName = input<string | undefined>(undefined);
	/** Show a skeleton in the leaf crumb while the record is loading. */
	readonly loading = input<boolean>(false);
	/** Prepend a Home crumb (default `true`). */
	readonly includeHome = input<boolean>(true);
	/** Label for the Home crumb (default `Home`). */
	readonly homeLabel = input<string>("Home");

	/** `true` when the crumb should render list + record leaves. */
	protected readonly isDetailView = computed(() => this.loading() || !!this.recordName());
}
