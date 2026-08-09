"use strict";
/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAndDebugTests = void 0;
const apex_node_1 = require("@salesforce/apex-node");
const effect_ext_utils_1 = require("@salesforce/effect-ext-utils");
const Effect = require("effect/Effect");
const vscode = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const checkpointService_1 = require("../breakpoints/checkpointService");
const messages_1 = require("../messages");
const ensureTraceFlags_1 = require("../services/ensureTraceFlags");
const runtime_1 = require("../services/runtime");
const settings_1 = require("../utils/settings");
const launchFromLogFile_1 = require("./launchFromLogFile");
const debugTest = Effect.fn('ApexReplayDebugger.debugTest')(function* (testClass, testName) {
    const api = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi;
    // ProjectService's folders (test results, debug logs) need an open workspace, so there's nothing to do
    // without one
    const { isEmpty } = yield* api.services.WorkspaceService.getWorkspaceInfo();
    if (isEmpty)
        return false;
    const connection = yield* api.services.ConnectionService.getConnection();
    if (!(yield* Effect.promise(() => (0, ensureTraceFlags_1.ensureTraceFlagsForCurrentUser)())))
        return false;
    if (checkpointService_1.checkpointService.hasOneOrMoreActiveCheckpoints()) {
        if (!(yield* Effect.promise(() => (0, checkpointService_1.sfCreateCheckpoints)())))
            return false;
    }
    const testService = new apex_node_1.TestService(connection);
    const singleTestName = testName ? `${testClass}.${testName}` : undefined;
    const payload = yield* Effect.promise(() => testService.buildSyncPayload("RunSpecifiedTests" /* TestLevel.RunSpecifiedTests */, singleTestName, singleTestName ? undefined : testClass, undefined, !(0, settings_1.retrieveTestCodeCoverage)() // the setting enables code coverage, so we need to pass false to disable it
    ));
    // W-18453221
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const result = (yield* Effect.promise(() => testService.runTestSynchronous(payload, true)));
    const dirPath = (yield* api.services.ProjectService.getApexTestResultsFolder()).fsPath;
    yield* Effect.promise(() => testService.writeResultFiles(result, { dirPath, resultFormats: [apex_node_1.ResultFormat.json] }, (0, settings_1.retrieveTestCodeCoverage)()));
    const tests = result.tests;
    if (tests.length === 0) {
        void vscode.window.showErrorMessage(messages_1.nls.localize('debug_test_no_results_found'));
        return false;
    }
    const testResult = testName ? (tests.find(test => test.methodName === testName) ?? tests[0]) : tests[0];
    if (!testResult?.apexLogId) {
        void vscode.window.showErrorMessage(messages_1.nls.localize('debug_test_no_debug_log'));
        return false;
    }
    const logId = testResult.apexLogId;
    const logService = new apex_node_1.LogService(connection);
    const debugLogsFolder = yield* api.services.ProjectService.getDebugLogsFolder();
    yield* Effect.promise(() => logService.getLogs({ logId, outputDir: debugLogsFolder.fsPath }));
    yield* Effect.promise(() => (0, launchFromLogFile_1.launchFromLogFile)(vscode_uri_1.Utils.joinPath(debugLogsFolder, `${logId}.log`).fsPath, false));
    return true;
});
const setupAndDebugTests = async (className, methodName) => {
    const success = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Running ${messages_1.nls.localize('debug_test_exec_name')}`,
        cancellable: false
    }, () => (0, runtime_1.getRuntime)()
        .runPromise(debugTest(className, methodName))
        .catch((error) => {
        void vscode.window.showErrorMessage(messages_1.nls.localize('debug_test_failed', String(error)));
    }));
    if (success) {
        void vscode.window.showInformationMessage(messages_1.nls.localize('debug_test_success'));
    }
};
exports.setupAndDebugTests = setupAndDebugTests;
//# sourceMappingURL=quickLaunch.js.map