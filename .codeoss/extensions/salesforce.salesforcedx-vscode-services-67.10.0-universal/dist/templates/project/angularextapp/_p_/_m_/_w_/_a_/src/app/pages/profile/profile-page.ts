/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
	signal,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AuthFormComponent } from "../../features/authentication/auth-form/auth-form";
import { ReactiveFormPageBase } from "../../features/authentication/reactive-form-page.base";
import { StatusAlertComponent } from "../../features/authentication/status-alert/status-alert";
import { FieldComponent } from "../../components/ui/field/field";
import { InputComponent } from "../../components/ui/input/input";
import { SkeletonComponent } from "../../components/ui/skeleton/skeleton";
import { AuthService } from "../../features/authentication/auth/auth.service";
import { UserProfileService } from "../../api/user-profile.service";
import { ROUTES } from "../../features/authentication/config/authentication.config";
import {
	emailValidator,
	requiredWithMessage,
} from "../../features/authentication/utils/auth-validators";

/**
 * The profile form value shape (mirrors the React `ProfileFormValues`).
 *
 * Declared as a `type` (not an `interface`) so it is assignable to
 * `Record<string, unknown>` when passed to `UserProfileService.updateUserProfile`:
 * an interface is not index-signature-assignable (it can be augmented via
 * declaration merging), whereas a type-literal is.
 */
type ProfileFormValues = {
	FirstName: string;
	LastName: string;
	Email: string;
	Phone: string | null;
	Street: string | null;
	City: string | null;
	State: string | null;
	PostalCode: string | null;
	Country: string | null;
};

/**
 * Profile page — Angular port of the React `Profile`. Protected route.
 *
 * Loads the current user's profile via GraphQL (`UserProfileService`) on init,
 * showing a skeleton while loading. Email is read-only. On submit it updates
 * via GraphQL and merges the returned record with the submitted values so
 * FLS-hidden fields don't blank the form — identical to the React merge logic.
 * `showAlreadyLoggedIn` is false.
 */
@Component({
	selector: "app-profile-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AuthFormComponent,
		StatusAlertComponent,
		FieldComponent,
		InputComponent,
		SkeletonComponent,
	],
	templateUrl: "./profile-page.html",
})
export class ProfilePageComponent extends ReactiveFormPageBase implements OnInit {
	private readonly fb = inject(FormBuilder);
	private readonly authService = inject(AuthService);
	private readonly profileService = inject(UserProfileService);

	protected readonly routes = ROUTES;
	private readonly user = this.authService.requireUser();

	protected override readonly form = this.fb.group({
		FirstName: ["", [requiredWithMessage("First name is required")]],
		LastName: ["", [requiredWithMessage("Last name is required")]],
		Email: [{ value: "", disabled: true }, [emailValidator]],
		Phone: [""],
		Street: [""],
		City: [""],
		State: [""],
		PostalCode: [""],
		Country: [""],
	});

	protected readonly loadError = signal<string | null>(null);
	protected readonly submitError = signal<string | null>(null);
	protected readonly submitting = signal<boolean>(false);
	protected readonly success = signal<boolean>(false);
	private readonly loaded = signal<boolean>(false);

	/** True until the profile has loaded and no load error occurred. */
	protected readonly loading = computed(() => !this.loaded() && this.loadError() === null);

	ngOnInit(): void {
		void this.loadProfile();
	}

	private async loadProfile(): Promise<void> {
		try {
			const data = await this.profileService.fetchUserProfile<Partial<ProfileFormValues>>(
				this.user.id,
			);
			// Merge with defaults so missing fields (e.g. due to FLS) don't break the form.
			this.applyProfile({
				FirstName: data.FirstName ?? "",
				LastName: data.LastName ?? "",
				Email: data.Email ?? "",
				Phone: data.Phone ?? null,
				Street: data.Street ?? null,
				City: data.City ?? null,
				State: data.State ?? null,
				PostalCode: data.PostalCode ?? null,
				Country: data.Country ?? null,
			});
			this.loaded.set(true);
		} catch (err) {
			console.error("Failed to load profile", err);
			this.loadError.set("Failed to load profile");
		}
	}

	private applyProfile(profile: ProfileFormValues): void {
		this.form.reset({
			FirstName: profile.FirstName,
			LastName: profile.LastName,
			Email: profile.Email,
			Phone: profile.Phone ?? "",
			Street: profile.Street ?? "",
			City: profile.City ?? "",
			State: profile.State ?? "",
			PostalCode: profile.PostalCode ?? "",
			Country: profile.Country ?? "",
		});
	}

	protected async onSubmit(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		}
		this.submitError.set(null);
		this.success.set(false);
		this.submitting.set(true);
		try {
			// getRawValue includes the disabled Email control.
			const raw = this.form.getRawValue();
			const value: ProfileFormValues = {
				FirstName: (raw.FirstName ?? "").trim(),
				LastName: (raw.LastName ?? "").trim(),
				Email: (raw.Email ?? "").trim(),
				Phone: this.optional(raw.Phone),
				Street: this.optional(raw.Street),
				City: this.optional(raw.City),
				State: this.optional(raw.State),
				PostalCode: this.optional(raw.PostalCode),
				Country: this.optional(raw.Country),
			};
			const updated = await this.profileService.updateUserProfile<Partial<ProfileFormValues>>(
				this.user.id,
				value,
			);
			// Merge with submitted values so missing fields (e.g. FLS) don't break the form.
			this.applyProfile({
				FirstName: updated.FirstName ?? value.FirstName ?? "",
				LastName: updated.LastName ?? value.LastName ?? "",
				Email: updated.Email ?? value.Email ?? "",
				Phone: updated.Phone ?? value.Phone ?? null,
				Street: updated.Street ?? value.Street ?? null,
				City: updated.City ?? value.City ?? null,
				State: updated.State ?? value.State ?? null,
				PostalCode: updated.PostalCode ?? value.PostalCode ?? null,
				Country: updated.Country ?? value.Country ?? null,
			});
			this.success.set(true);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err) {
			console.error("Failed to update profile", err);
			this.submitError.set("Failed to update profile");
		} finally {
			this.submitting.set(false);
		}
	}

	/** Mirrors the React `optionalString`: trim and coerce empty to null. */
	private optional(value: string | null | undefined): string | null {
		const trimmed = (value ?? "").trim();
		return trimmed === "" ? null : trimmed;
	}
}
