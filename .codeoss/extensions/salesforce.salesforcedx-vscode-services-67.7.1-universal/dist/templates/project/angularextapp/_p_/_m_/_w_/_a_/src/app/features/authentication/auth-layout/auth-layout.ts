/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AppLayoutComponent } from "../../../components/layout/app-layout/app-layout";
import { SessionTimeoutValidatorComponent } from "../session/session";

/**
 * Top-level app wrapper — the faithful Angular port of the React `AuthAppLayout`
 * (`<AuthProvider><SessionTimeoutValidator/><AppLayout/></AuthProvider>`).
 *
 * There is no AuthProvider equivalent: `AuthService` is `providedIn: 'root'`, so
 * auth state is app-wide automatically. This component renders the
 * session-timeout validator (whose warning modal is thus available on every
 * child route, exactly like React) followed by the base `app-layout`. Child
 * routes render inside the base layout's own `<router-outlet />` post-compose.
 *
 * Wired as the top route node's `component` in `app.routes.ts`; the route-merger
 * swaps the base layout node for this wrapper (the same element-swap object-search
 * performs by repeating `component: AppLayoutComponent`).
 */
@Component({
	selector: "app-auth-app-layout",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SessionTimeoutValidatorComponent, AppLayoutComponent],
	templateUrl: "./auth-layout.html",
})
export class AuthAppLayoutComponent {}
