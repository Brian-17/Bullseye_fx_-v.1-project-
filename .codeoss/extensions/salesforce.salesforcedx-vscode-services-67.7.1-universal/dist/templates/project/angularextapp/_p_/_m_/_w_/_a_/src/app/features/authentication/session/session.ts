/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	inject,
	OnInit,
	signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { DialogComponent } from "../../../components/ui/dialog/dialog";
import { StatusAlertComponent } from "../status-alert/status-alert";
import { ButtonComponent } from "../../../components/ui/button/button";
import { AuthService } from "../auth/auth.service";
import { SessionTimeoutService } from "../utils/session-timeout.service";
import { LABELS, STORAGE_KEYS } from "../utils/session-timeout.config";
import { ROUTES } from "../config/authentication.config";

/**
 * Session-timeout validator — the Angular port of the React
 * `SessionTimeoutValidator`. Rendered app-wide by `AuthAppLayoutComponent` so
 * the warning modal is available on every route (exactly like React).
 *
 * Responsibilities (all mirrored from React):
 * - Starts polling via `SessionTimeoutService` on init, skipping guest users.
 * - Shows a non-dismissable warning modal with a live countdown when the session
 *   nears expiry; "Continue" extends the session, "Log Out" logs out.
 * - When the countdown reaches 0 it re-checks the server before logging out
 *   (prevents premature logout).
 * - On expiry it sets the `showSessionMessage` sessionStorage flag then calls
 *   `AuthService.logout(window.location.pathname)` (hard nav).
 * - On the login page, if the flag is set, shows the session-expired alert once
 *   (lazily read at init, since the expiry logout hard-navigates and this
 *   component always remounts fresh on login).
 *
 * `SessionTimeoutService` is provided here so its timers are scoped to this
 * component's lifetime (mirrors the hook's unmount cleanup).
 */
@Component({
	selector: "app-session-timeout-validator",
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [SessionTimeoutService],
	imports: [DialogComponent, StatusAlertComponent, ButtonComponent],
	templateUrl: "./session.html",
})
export class SessionTimeoutValidatorComponent implements OnInit {
	private readonly authService = inject(AuthService);
	private readonly session = inject(SessionTimeoutService);
	private readonly destroyRef = inject(DestroyRef);
	private readonly router = inject(Router);

	protected readonly labels = LABELS;

	// Community base path. React hard-codes "" here (root-relative); kept identical.
	private readonly basePath = "";

	// -- Exposed session state (from the service) ----------------------------
	protected readonly showWarningModal = this.session.showWarningModal;
	protected readonly timeLeftInSession = this.session.timeLeftInSession;

	// -- Session-expired alert (lazy, read once at init) ---------------------
	protected readonly showExpiredAlert = signal<boolean>(false);

	// -- Countdown state (mirrors useCountdownTimer) -------------------------
	protected readonly countdownSeconds = signal<number>(0);
	private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
	private countdownEndTime = 0;
	private lastModalOpen = false;

	constructor() {
		// React's SessionWarningModal resets+starts the countdown when the modal
		// opens and stops it when it closes. This effect mirrors that: it reacts to
		// the warning-modal signal and (re)starts the countdown from the latest
		// remaining time whenever the modal is open.
		effect(() => {
			const open = this.showWarningModal();
			const remaining = this.timeLeftInSession() ?? 0;
			if (open) {
				this.startCountdown(remaining);
			} else if (this.lastModalOpen) {
				this.stopCountdown();
			}
			this.lastModalOpen = open;
		});

		// Auto-logout when the countdown/poll reports the session is expired and the
		// user is not a guest (mirrors the React expiry `useEffect`).
		effect(() => {
			const timeLeft = this.timeLeftInSession();
			if (timeLeft !== null && timeLeft <= 0 && !this.isGuest()) {
				this.handleLogout();
			}
		});
	}

	ngOnInit(): void {
		// Session-expired alert: checked once at init via a lazy read. The expiry
		// handler triggers a hard navigation, so this component always mounts fresh
		// on the login page after expiry.
		//
		// Compare against the router's parsed URL (base-href/community-path stripped)
		// rather than `window.location.pathname`: the raw browser path includes any
		// base href (e.g. `/sfsites/c/.../login`) and would never equal `/login`,
		// silently hiding the banner. `router.url` is router-relative, matching the
		// React `useLocation().pathname` behavior. Strip the query/fragment before
		// comparing.
		const routerPath = this.router.url.split(/[?#]/)[0];
		const isLoginPage = routerPath === ROUTES.LOGIN.PATH;
		const shouldShow =
			isLoginPage && sessionStorage.getItem(STORAGE_KEYS.SHOW_SESSION_MESSAGE) === "true";
		if (shouldShow) {
			sessionStorage.removeItem(STORAGE_KEYS.SHOW_SESSION_MESSAGE);
			this.showExpiredAlert.set(true);
		}

		// Start monitoring (service skips guests internally).
		this.session.start(this.basePath, this.isGuest());

		this.destroyRef.onDestroy(() => {
			this.session.stop();
			this.stopCountdown();
		});
	}

	private isGuest(): boolean {
		return !this.authService.isAuthenticated();
	}

	// -- Countdown ------------------------------------------------------------

	private startCountdown(seconds: number): void {
		this.stopCountdown();
		this.countdownSeconds.set(seconds);
		this.countdownEndTime = Date.now() + seconds * 1000;
		this.countdownIntervalId = setInterval(() => {
			const remainingMs = this.countdownEndTime - Date.now();
			const newTime = Math.max(0, Math.ceil(remainingMs / 1000));
			this.countdownSeconds.set(newTime);
			if (newTime <= 0) {
				this.stopCountdown();
				// Re-check with the server before logging out (React onCountdownExpire).
				void this.session.checkSession();
			}
		}, 100);
	}

	private stopCountdown(): void {
		if (this.countdownIntervalId) {
			clearInterval(this.countdownIntervalId);
			this.countdownIntervalId = null;
		}
	}

	/** MM:SS formatted countdown (mirrors useCountdownTimer.formattedTime). */
	protected formattedTime(): string {
		const total = this.countdownSeconds();
		const minutes = Math.floor(total / 60);
		const secs = total % 60;
		const pad = (n: number) => n.toString().padStart(2, "0");
		return `${pad(minutes)}:${pad(secs)}`;
	}

	/** ISO 8601 duration for the <time> element (mirrors isoTime). */
	protected isoTime(): string {
		const total = this.countdownSeconds();
		const minutes = Math.floor(total / 60);
		const secs = total % 60;
		return `PT${minutes}M${secs}S`;
	}

	// -- Actions --------------------------------------------------------------

	/** "Continue" — stop countdown and extend the session. */
	protected onContinue(): void {
		this.stopCountdown();
		void this.session.extendSession();
	}

	/** "Log Out" button in the warning modal. */
	protected onLogoutClick(): void {
		this.stopCountdown();
		this.handleLogout();
	}

	/** Dismiss the session-expired alert. */
	protected onDismissAlert(): void {
		this.showExpiredAlert.set(false);
	}

	/**
	 * Set the session-message flag, stop monitoring, then hand off to the
	 * centralized logout (hard nav). Passes the current pathname as the return
	 * URL. Mirrors the React `handleLogout`.
	 */
	private handleLogout(): void {
		sessionStorage.setItem(STORAGE_KEYS.SHOW_SESSION_MESSAGE, "true");
		this.session.stop();
		this.authService.logout(window.location.pathname);
	}
}
