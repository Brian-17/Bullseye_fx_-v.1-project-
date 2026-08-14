"use strict";
/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugConfigurationProvider = void 0;
const effect_ext_utils_1 = require("@salesforce/effect-ext-utils");
const salesforcedx_utils_vscode_1 = require("@salesforce/salesforcedx-utils-vscode");
const Effect = require("effect/Effect");
const Predicate_1 = require("effect/Predicate");
const vscode = require("vscode");
const debuggerConstants_1 = require("../debuggerConstants");
const messages_1 = require("../messages");
const heapDumpOverlayFetch_1 = require("../services/heapDumpOverlayFetch");
const runtime_1 = require("../services/runtime");
class DebugConfigurationProvider {
    salesforceApexExtension = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-apex');
    static getConfig(logFile, stopOnEntry = true) {
        return {
            name: messages_1.nls.localize('config_name_text'),
            type: debuggerConstants_1.DEBUGGER_TYPE,
            request: debuggerConstants_1.DEBUGGER_LAUNCH_TYPE,
            logFile: logFile ?? '${command:AskForLogFileName}',
            stopOnEntry,
            trace: true
        };
    }
    provideDebugConfigurations(_folder, _token) {
        return [DebugConfigurationProvider.getConfig()];
    }
    resolveDebugConfiguration(_folder, config, _token) {
        return this.asyncDebugConfig(config).catch(async (err) => vscode.window.showErrorMessage((0, salesforcedx_utils_vscode_1.errorToString)(err), { modal: true }).then(() => undefined));
    }
    async asyncDebugConfig(config) {
        config.name = config.name || messages_1.nls.localize('config_name_text');
        config.type = config.type || debuggerConstants_1.DEBUGGER_TYPE;
        config.request = config.request || debuggerConstants_1.DEBUGGER_LAUNCH_TYPE;
        config.logFile = config.logFile ?? '${command:AskForLogFileName}';
        if ((0, Predicate_1.isUndefined)(config.stopOnEntry)) {
            config.stopOnEntry = true;
        }
        if ((0, Predicate_1.isUndefined)(config.trace)) {
            config.trace = true;
        }
        if (vscode.workspace?.workspaceFolders?.[0]) {
            config.projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        if (!this.salesforceApexExtension?.isActive) {
            await this.salesforceApexExtension?.activate();
        }
        if (this.salesforceApexExtension?.exports) {
            await this.isLanguageClientReady();
            config.lineBreakpointInfo = await this.salesforceApexExtension.exports.getLineBreakpointInfo();
        }
        // Handle log file reading for web compatibility
        if (config.logFile && config.logFile !== '${command:AskForLogFileName}') {
            // Direct file path provided
            try {
                config.logFileContents = await (0, runtime_1.getRuntime)().runPromise(readLogFile(config.logFile));
                config.logFilePath = config.logFile;
                config.logFileName = getBasename(config.logFile);
                // Remove logFile since we're now using logFileContents
                delete config.logFile;
            }
            catch (error) {
                console.error('Failed to read log file:', error);
                // errorToString keeps the single-line message; interpolating the runPromise rejection would
                // paste Effect's multi-line pretty-printed cause (with stack) into the modal dialog.
                throw new Error(`Failed to read log file: ${(0, salesforcedx_utils_vscode_1.errorToString)(error)}`);
            }
        }
        else if (config.logFile === '${command:AskForLogFileName}') {
            // User needs to select a file
            try {
                const logFilePath = await vscode.commands.executeCommand('extension.replay-debugger.getLogFileName');
                if (logFilePath && (0, Predicate_1.isString)(logFilePath)) {
                    config.logFileContents = await (0, runtime_1.getRuntime)().runPromise(readLogFile(logFilePath));
                    config.logFilePath = logFilePath;
                    config.logFileName = getBasename(logFilePath);
                    // Remove logFile since we're now using logFileContents
                    delete config.logFile;
                }
                else {
                    throw new Error('No log file selected');
                }
            }
            catch (error) {
                console.error('Failed to read selected log file:', error);
                throw new Error(`Failed to read selected log file: ${(0, salesforcedx_utils_vscode_1.errorToString)(error)}`);
            }
        }
        if (typeof config.logFileContents === 'string' && config.logFileContents.includes('|HEAP_DUMP|')) {
            config.heapDumpResults = await resolveHeapDumpResults(config.logFileContents);
        }
        return config;
    }
    async isLanguageClientReady() {
        if (!this.salesforceApexExtension?.exports) {
            throw new Error('Apex extension not available');
        }
        let expired = false;
        let i = 0;
        while (!this.salesforceApexExtension.exports.languageClientManager.getStatus().isReady() && !expired) {
            if (this.salesforceApexExtension.exports.languageClientManager.getStatus().failedToInitialize()) {
                throw Error(this.salesforceApexExtension.exports.languageClientManager.getStatus().getStatusMessage());
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            if (i >= 30) {
                expired = true;
            }
            i++;
        }
        if (expired) {
            throw new Error(messages_1.nls.localize('language_client_not_ready'));
        }
    }
}
exports.DebugConfigurationProvider = DebugConfigurationProvider;
/**
 * Reads a log file through FsService so desktop and web (virtual fs) both work.
 * Fails with FsServiceError; the promise-based callers keep their own error handling.
 */
const readLogFile = Effect.fn('ApexReplayDebugger.readLogFile')(function* (filePath) {
    const api = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi;
    return yield* api.services.FsService.readFile(filePath);
});
/**
 * Resolves the target-org connection and batch-fetches overlay results for every heap dump in the log.
 * Non-fatal: an org-resolution/fetch failure attaches a single error marker so the adapter surfaces it,
 * matching prior behavior where a failed fetch still launches the session.
 */
const resolveHeapDumpResults = (logFileContents) => {
    // Org/connection resolution failures keep the localized org-info label; a HeapDumpOverlayFetchError
    // is a batch-request failure, so it surfaces its own message rather than being mislabeled as org-info.
    const orgInfoError = (error) => Effect.succeed([
        { heapDumpId: '', error: `${messages_1.nls.localize('unable_to_retrieve_org_info')} : ${(0, salesforcedx_utils_vscode_1.errorToString)(error)}` }
    ]);
    return (0, heapDumpOverlayFetch_1.fetchHeapDumpOverlayResults)(logFileContents).pipe(Effect.catchTag('HeapDumpOverlayFetchError', error => Effect.succeed([{ heapDumpId: '', error: (0, salesforcedx_utils_vscode_1.errorToString)(error) }])), 
    // Everything else (org/connection resolution failures) keeps the localized org-info label.
    Effect.catchAll(orgInfoError), (0, runtime_1.getRuntime)().runPromise);
};
// Helper function to extract filename from path (web-compatible)
const getBasename = (filePath) => {
    // Handle both forward and backward slashes
    const normalizedPath = filePath.replaceAll('\\', '/');
    const parts = normalizedPath.split('/');
    return parts.at(-1) ?? filePath;
};
//# sourceMappingURL=debugConfigurationProvider.js.map