"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anonApexDebug = exports.getYYYYMMddHHmmssDateFormat = exports.makeDoubleDigit = void 0;
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
const runtime_1 = require("../services/runtime");
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
    if (!logs)
        return false;
    yield* api.services.FsService.safeWriteFile(logFilePath, logs);
    yield* Effect.promise(() => vscode.commands.executeCommand('sf.launch.replay.debugger.logfile.path', logFilePath.fsPath));
    return true;
});
const getAnonApexContext = Effect.fn('ApexReplayDebugger.getAnonApexContext')(function* () {
    const api = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi;
    const { isEmpty } = yield* api.services.WorkspaceService.getWorkspaceInfo();
    if (isEmpty)
        return undefined;
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return undefined;
    const document = editor.document;
    if (!editor.selection.isEmpty || document.isUntitled || document.isDirty) {
        return {
            kind: 'code',
            apexCode: !editor.selection.isEmpty ? document.getText(editor.selection) : document.getText(),
            selectionRange: !editor.selection.isEmpty
                ? new vscode.Range(editor.selection.start, editor.selection.end)
                : undefined,
            documentUri: vscode_uri_1.URI.parse(document.uri.toString())
        };
    }
    return {
        kind: 'file',
        filePath: document.uri.fsPath,
        documentUri: vscode_uri_1.URI.file(document.uri.fsPath)
    };
});
const executeAnonApexDebug = Effect.fn('ApexReplayDebugger.executeAnonApexDebug')(function* () {
    const ctx = yield* getAnonApexContext();
    if (!ctx)
        return false;
    const api = yield* (yield* effect_ext_utils_1.ExtensionProviderService).getServicesApi;
    const code = ctx.kind === 'code' ? ctx.apexCode : yield* api.services.FsService.readFile(ctx.filePath);
    if (!code)
        return false;
    const { result, logBody } = yield* api.services.ExecuteAnonymousService.executeAndRetrieveLog(code);
    yield* api.services.ExecuteAnonymousService.reportExecResult(result, ctx.documentUri, ctx.kind === 'code' ? ctx.selectionRange?.start.line : undefined);
    if (!result.compiled || !result.success)
        return false;
    const logFilePath = vscode_uri_1.Utils.joinPath(yield* api.services.ProjectService.getDebugLogsFolder(), `${(0, exports.getYYYYMMddHHmmssDateFormat)(new Date())}.log`);
    return yield* launchReplayDebugger(logFilePath, logBody ?? undefined);
});
const anonApexDebug = async () => {
    const success = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: messages_1.nls.localize('apex_execute_text'), cancellable: false }, () => (0, runtime_1.getRuntime)()
        .runPromise(executeAnonApexDebug())
        .catch((error) => {
        void vscode.window.showErrorMessage(messages_1.nls.localize('apex_execute_debug_failed', String(error)));
    }));
    if (success) {
        void vscode.window.showInformationMessage(messages_1.nls.localize('apex_execute_debug_success'));
    }
};
exports.anonApexDebug = anonApexDebug;
//# sourceMappingURL=anonApexDebug.js.map