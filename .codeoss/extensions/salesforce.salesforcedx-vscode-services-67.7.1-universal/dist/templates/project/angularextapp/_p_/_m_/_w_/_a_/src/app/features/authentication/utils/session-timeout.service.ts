/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { Injectable, signal } from "@angular/core";
import {
	extendSessionTime,
	pollSessionTimeServlet,
	type SessionResponse,
} from "./session-time-servlet";
import {
	INITIAL_RETRY_DELAY,
	MAX_RETRY_ATTEMPTS,
	MAX_RETRY_DELAY,
	SESSION_WARNING_TIME,
} from "./session-timeout.config";

/**
 * Session-timeout monitoring service — the Angular port of the React
 * `useSessionTimeout` hook (plus the inlined `useRetryWithBackoff`). Polls
 * SessionTimeServlet at calculated intervals, shows the warning window when the
 * session nears expiry, and retries failed polls with exponential backoff.
 *
 * State is exposed as signals; the owning `SessionTimeoutValidatorComponent`
 * reacts to them and performs navigation/logout (this service, like the React
 * hook, never navigates — it only tracks time and schedules checks).
 *
 * NOT `providedIn: 'root'`: it is provided by the validator component so its
 * timers are torn down with that component (mirrors the hook's unmount cleanup).
 */
@Injectable()
export class SessionTimeoutService {
	// -- Public session state (signals) --------------------------------------
	/** Seconds remaining in the current session (null until first response). */
	readonly timeLeftInSession = signal<number | null>(null);
	/** Whether the warning modal should be displayed. */
	readonly showWarningModal = signal<boolean>(false);
	/** Whether a poll is currently in flight. */
	readonly isPolling = signal<boolean>(false);

	// -- Retry (exponential backoff) state ------------------------------------
	private retryAttempts = 0;
	private currentRetryDelay = INITIAL_RETRY_DELAY;

	// -- Timer / guard bookkeeping --------------------------------------------
	private basePath = "";
	private pollTimeoutId: ReturnType<typeof setTimeout> | null = null;
	private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
	private isPollingGuard = false;

	private get maxRetriesReached(): boolean {
		return this.retryAttempts >= MAX_RETRY_ATTEMPTS;
	}

	private resetRetry(): void {
		this.retryAttempts = 0;
		this.currentRetryDelay = INITIAL_RETRY_DELAY;
	}

	private clearPollTimeout(): void {
		if (this.pollTimeoutId) {
			clearTimeout(this.pollTimeoutId);
			this.pollTimeoutId = null;
		}
	}

	private clearRetryTimeout(): void {
		if (this.retryTimeoutId) {
			clearTimeout(this.retryTimeoutId);
			this.retryTimeoutId = null;
		}
	}

	/**
	 * Schedule the next session check, clearing any pending poll/retry to prevent
	 * concurrent polling. Mirrors the hook's `scheduleCheck`.
	 */
	private scheduleCheck(delay: number): void {
		this.clearPollTimeout();
		this.clearRetryTimeout();
		this.pollTimeoutId = setTimeout(() => {
			void this.checkSession();
		}, delay);
	}

	/**
	 * Handle a failed poll/extend with exponential backoff. Mirrors the hook's
	 * `handleRetryWithBackoff` + `useRetryWithBackoff.scheduleRetry`.
	 */
	private handleRetryWithBackoff(retryAction: () => void): void {
		if (this.maxRetriesReached) {
			console.error("[SessionTimeout] Max retry attempts reached. Stopping polling.");
			this.isPolling.set(false);
			this.isPollingGuard = false;
			return;
		}

		if (this.isPollingGuard) {
			console.warn("[SessionTimeout] Poll already in progress, skipping retry scheduling");
			return;
		}

		this.clearRetryTimeout();

		const delay = this.currentRetryDelay;
		console.warn(
			`[SessionTimeout] Scheduling retry attempt ${this.retryAttempts + 1}/${MAX_RETRY_ATTEMPTS} in ${delay}ms`,
		);

		this.retryTimeoutId = setTimeout(() => {
			this.retryTimeoutId = null;
			retryAction();
		}, delay);

		this.retryAttempts += 1;
		// Double the delay for the next retry, capped at maxDelay.
		this.currentRetryDelay = Math.min(this.currentRetryDelay * 2, MAX_RETRY_DELAY);
	}

	/**
	 * Process a session response and schedule the next check. Mirrors the hook's
	 * `processTimeoutResponse`. When `sr <= 0` the component's effect performs
	 * logout; when within the warning window the modal is shown and a check is
	 * scheduled for expiry; otherwise a check is scheduled for when the warning
	 * should appear.
	 */
	private processTimeoutResponse(secondsRemaining: number): void {
		this.timeLeftInSession.set(secondsRemaining);

		if (secondsRemaining <= 0) {
			this.showWarningModal.set(false);
			// logout() is triggered by the component reacting to timeLeftInSession.
			return;
		}

		const shouldShowWarning = secondsRemaining <= SESSION_WARNING_TIME;

		if (shouldShowWarning) {
			this.showWarningModal.set(true);
			this.scheduleCheck(secondsRemaining * 1000);
		} else {
			const timeUntilWarning = (secondsRemaining - SESSION_WARNING_TIME) * 1000;
			this.showWarningModal.set(false);
			this.scheduleCheck(timeUntilWarning);
		}
	}

	/** Check session status via the servlet. Mirrors the hook's `checkSession`. */
	async checkSession(): Promise<void> {
		if (this.isPollingGuard) {
			return;
		}

		this.isPollingGuard = true;
		this.isPolling.set(true);

		const response = await pollSessionTimeServlet(this.basePath);
		this.isPollingGuard = false;
		this.isPolling.set(false);

		this.applyResponse(response, () => void this.checkSession());
	}

	/** Extend the session (user clicked "Continue"). Mirrors `extendSession`. */
	async extendSession(): Promise<void> {
		const response = await extendSessionTime(this.basePath);
		this.applyResponse(response, () => void this.extendSession());
	}

	private applyResponse(response: SessionResponse | undefined, retryAction: () => void): void {
		if (response) {
			this.resetRetry();
			this.processTimeoutResponse(response.sr);
		} else {
			this.handleRetryWithBackoff(retryAction);
		}
	}

	/**
	 * Begin monitoring. Skips guests (mirrors the hook's guest short-circuit) and
	 * kicks off the first check.
	 */
	start(basePath: string, isGuest: boolean): void {
		this.basePath = basePath;
		if (isGuest) {
			return;
		}
		void this.checkSession();
	}

	/** Stop monitoring and reset state. Mirrors the hook's `logout` cleanup. */
	stop(): void {
		this.clearPollTimeout();
		this.clearRetryTimeout();
		this.showWarningModal.set(false);
		this.timeLeftInSession.set(null);
		this.isPolling.set(false);
		this.isPollingGuard = false;
	}
}
