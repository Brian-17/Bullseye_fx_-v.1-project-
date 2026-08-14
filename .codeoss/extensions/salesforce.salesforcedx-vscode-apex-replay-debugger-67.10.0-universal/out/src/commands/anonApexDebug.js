"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anonApexDebugCommand = exports.getYYYYMMddHHmmssDateFormat = exports.makeDoubleDigit = void 0;
/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const effect_ext_utils_1 = require("@salesforce/effect-ext-utils");
const Effect = require("effect/Effect");
const node_util_1 = require("node:util");
const vscode = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const messages_1 = require("../messages");
const makeDoubleDigit = (currentDigit) => (0, node_util_1.format)('%d', currentDigit).padStart(2, '0');
exports.makeDoubleDigit = makeDoubleDigit;
const getYYYYMMddHHmmssDateFormat = (localUTCDate) => {
    const month2Digit = (0, exports.makeDoubleDigit)(localUTCDate.getMonth() + 1);
    const date2Digit = (0, exports.makeDoubleDigit)(localUTCDate.getDate());
    const hour2Digit = (0, exports.makeDoubleDigit)(localUTCDate.getHours());
    const mins2Digit = (0, exports.makeDoubleDigit)(localUTCDate.getMinutes());
    const sec2Digit = (0, exports.makeDoubleDigit)(localUTCDate.getSeconds());
    return `${localUTCDate.getFullYear()}${month2Digit}${date2Digit}${hour2Digit}${mins2Digit}${sec2Digit}`;
};
exports.getYYYYMMddHHmmssDateFormat = getYYYYMMddHHmmssDateFormat;
/** safeWriteFile creates the parent directory, so no separate createDirectory call is needed. */
const launchReplayDebugger = Effect.fn('ApexReplayDebugger.launchReplayDebugger')(function* (logFilePath, logs) {
    const api = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi;
    yield* api.services.FsService.safeWriteFile(logFilePath, logs);
    yield* Effect.promise(() => vscode.commands.executeCommand('sf.launch.replay.debugger.logfile.path', logFilePath.fsPath));
});
exports.anonApexDebugCommand = Effect.fn('ApexReplayDebugger.Command.anonApexDebug')(function* () {
    const api = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi;
    const promptService = yield* api.services.PromptService;
    const context = yield* api.services.EditorService.getActiveEditorContext(true);
    const executionResult = yield* Effect.gen(function* () {
        const { result, logBody } = yield* api.services.ExecuteAnonymousService.executeAndRetrieveLog(context.text);
        yield* api.services.ExecuteAnonymousService.reportExecResult(result, context.documentUri, context.selectionRange?.startLine);
        if (result.compiled && result.success) {
            const logFilePath = vscode_uri_1.Utils.joinPath(yield* api.services.ProjectService.getDebugLogsFolder(), `${(0, exports.getYYYYMMddHHmmssDateFormat)(new Date())}.log`);
            yield* launchReplayDebugger(logFilePath, logBody);
        }
        return result;
    }).pipe(promptService.withProgress(messages_1.nls.localize('apex_execute_text')));
    yield* Effect.sync(() => {
        if (executionResult.compiled && executionResult.success) {
            void vscode.window.showInformationMessage(messages_1.nls.localize('apex_execute_debug_success'));
        }
    });
});
//# sourceMappingURL=anonApexDebug.js.map