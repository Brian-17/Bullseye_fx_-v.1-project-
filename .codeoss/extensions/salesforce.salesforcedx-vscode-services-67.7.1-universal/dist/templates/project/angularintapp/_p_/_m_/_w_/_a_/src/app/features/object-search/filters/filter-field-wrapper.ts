/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
// Base-app UI wrapper, inherited (not recreated) by this feature. Post-compose
// it lands at uiBundles/<target>/src/app/components/ui/label/..., three levels up from this
// filter folder (app/object-search/filters/ -> app/components/ui/).
import { LabelComponent } from "../../../components/ui/label/label";

/**
 * Standard label + control + help/error scaffold shared by every filter
 * component (the Angular analogue of the React `FilterFieldWrapper`).
 *
 * The control itself is content-projected so each filter can supply the
 * primitive that fits its data type (input, select, popover, date picker, ...)
 * while the wrapper keeps the layout, label, and error/help affordances
 * consistent across the search page.
 */
@Component({
	selector: "app-filter-field-wrapper",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LabelComponent],
	templateUrl: "./filter-field-wrapper.html",
})
export class FilterFieldWrapperComponent {
	/** Visible field label rendered above the control. */
	readonly label = input.required<string>();
	/** Optional `for` attribute forwarded to the underlying `<label>`. */
	readonly htmlFor = input<string | null>(null);
	/** Advisory copy rendered below the control when there is no error. */
	readonly helpText = input<string | undefined>(undefined);
	/** Validation message; when set, replaces the help text. */
	readonly error = input<string | undefined>(undefined);
}
