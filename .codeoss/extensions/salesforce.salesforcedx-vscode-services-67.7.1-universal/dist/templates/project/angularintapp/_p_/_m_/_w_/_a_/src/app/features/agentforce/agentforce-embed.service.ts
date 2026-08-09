/**
 * Copyright (c) 2026, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { Injectable } from "@angular/core";
import {
	embedAgentforceClient,
	type AgentforceClientConfig,
} from "@salesforce/agentforce-conversation-client";
import type {
	AgentforceErrorHandler,
	AgentforceReadyHandler,
	ResolvedEmbedOptions,
} from "../../types/conversation";

/** Optional ready/error handlers forwarded to the embed client. */
export interface AgentforceEmbedHandlers {
	onReady?: AgentforceReadyHandler;
	onError?: AgentforceErrorHandler;
}

const GLOBAL_HOST_ID = "agentforce-conversation-client-global-host";
const EXISTING_EMBED_SELECTOR = 'lightning-out-application[data-lo="acc"]';

/**
 * App-wide singleton that owns the one-time Lightning Out embed of the
 * Agentforce Conversation Client. The Angular analogue of the React
 * `window.__agentforceConversationClientSingleton`: because the service is
 * `providedIn: 'root'`, a single instance is shared across the app, so its
 * `initialized` / `initPromise` fields guarantee exactly one embed per app —
 * regardless of how many client components mount.
 *
 * A valid Salesforce session is required for the given org; auth is resolved at
 * embed time (frontdoor URL in dev via `/__lo/frontdoor`, `SFDC_ENV.orgUrl` in
 * prod). Config is passed through to the embed client as-is.
 */
@Injectable({ providedIn: "root" })
export class AgentforceEmbedService {
	private initialized = false;
	private initPromise?: Promise<void>;

	/**
	 * Embed the client once. Subsequent calls are no-ops while an embed is in
	 * flight or already complete. `host` is the inline container element (when
	 * rendering inline); when omitted the global floating host is used.
	 */
	embed(
		config: AgentforceClientConfig,
		overrides: ResolvedEmbedOptions,
		host?: HTMLElement | null,
		handlers?: AgentforceEmbedHandlers,
	): void {
		if (!config.agentId) {
			throw new Error(
				"AgentforceConversationClient requires agentId. " +
					"Pass flat inputs only (agentId, agentLabel, inline, headerEnabled, showHeaderIcon, width, height, styleTokens).",
			);
		}

		const inline = config.renderingConfig?.mode === "inline";
		if (inline && !host) {
			// Inline host not yet in the DOM — the component retries after render.
			return;
		}

		if (this.initialized || this.initPromise) {
			return;
		}

		const shouldFetchFrontdoor = window.location.hostname === "localhost";

		if (shouldFetchFrontdoor) {
			this.initPromise = fetch("/__lo/frontdoor")
				.then(async (res) => {
					if (!res.ok) {
						console.error("frontdoor fetch failed");
						return;
					}
					const { frontdoorUrl: resolvedFrontdoorUrl } = await res.json();
					this.safeInitialize(
						config,
						{ ...overrides, frontdoorUrl: resolvedFrontdoorUrl },
						host,
						handlers,
					);
				})
				.catch((err) => {
					console.error("AgentforceConversationClient: failed to fetch frontdoor URL", err);
				})
				.finally(() => {
					this.initPromise = undefined;
				});
		} else {
			this.initPromise = Promise.resolve()
				.then(() => {
					this.safeInitialize(
						config,
						{ ...this.getDefaultEmbedOptions(), ...overrides },
						host,
						handlers,
					);
				})
				.catch((err) => {
					console.error("AgentforceConversationClient: failed to embed Agentforce client", err);
				})
				.finally(() => {
					this.initPromise = undefined;
				});
		}
	}

	private safeInitialize(
		config: AgentforceClientConfig,
		options: ResolvedEmbedOptions,
		host?: HTMLElement | null,
		handlers?: AgentforceEmbedHandlers,
	): void {
		try {
			this.initialize(config, options, host, handlers);
		} catch (initErr) {
			console.error("AgentforceConversationClient: initialization failed", initErr);
			this.initialized = false;
		}
	}

	private initialize(
		config: AgentforceClientConfig,
		options: ResolvedEmbedOptions,
		host?: HTMLElement | null,
		handlers?: AgentforceEmbedHandlers,
	): void {
		if (this.initialized) {
			return;
		}

		const existingEmbed = document.querySelector(EXISTING_EMBED_SELECTOR);
		if (existingEmbed) {
			this.initialized = true;
			return;
		}

		const inline = config.renderingConfig?.mode === "inline";
		const container = inline ? host! : this.getOrCreateGlobalHost();

		try {
			embedAgentforceClient({
				container,
				salesforceOrigin: options.salesforceOrigin,
				frontdoorUrl: options.frontdoorUrl,
				agentforceClientConfig: config,
				onReady: handlers?.onReady,
				onError: handlers?.onError,
			});
			this.initialized = true;
		} catch (err) {
			// Strip a partially-created LO element so the next mount can retry.
			const partialEmbed = document.querySelector(EXISTING_EMBED_SELECTOR);
			partialEmbed?.remove();
			console.error("AgentforceConversationClient: initialization failed", err);
		}
	}

	private getOrCreateGlobalHost(): HTMLDivElement {
		let host = document.getElementById(GLOBAL_HOST_ID) as HTMLDivElement | null;
		if (!host) {
			host = document.createElement("div");
			host.id = GLOBAL_HOST_ID;
			document.body.appendChild(host);
		}
		return host;
	}

	private getDefaultEmbedOptions(): ResolvedEmbedOptions {
		return { salesforceOrigin: SFDC_ENV?.orgUrl };
	}
}
