"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchApexReplayDebuggerWithCurrentFile = void 0;
/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const effect_ext_utils_1 = require("@salesforce/effect-ext-utils");
const node_path_1 = require("node:path");
const vscode = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const messages_1 = require("../messages");
const launchApexReplayDebuggerWithCurrentFile = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        void vscode.window.showErrorMessage(messages_1.nls.localize('unable_to_locate_editor'));
        return;
    }
    const sourceUri = editor.document.uri;
    if (!sourceUri) {
        void vscode.window.showErrorMessage(messages_1.nls.localize('unable_to_locate_document'));
        return;
    }
    if (isLogFile(sourceUri)) {
        await launchReplayDebuggerLogFile(sourceUri);
        return;
    }
    if (isAnonymousApexFile(sourceUri)) {
        await launchAnonymousApexReplayDebugger();
        return;
    }
    const apexTestClassName = getApexTestClassName(editor.document);
    if (apexTestClassName) {
        await launchApexReplayDebugger(apexTestClassName);
        return;
    }
    void vscode.window.showErrorMessage(messages_1.nls.localize('launch_apex_replay_debugger_unsupported_file'));
};
exports.launchApexReplayDebuggerWithCurrentFile = launchApexReplayDebuggerWithCurrentFile;
const isLogFile = (sourceUri) => vscode_uri_1.Utils.extname(sourceUri).toLowerCase() === '.log';
const isAnonymousApexFile = (sourceUri) => vscode_uri_1.Utils.extname(sourceUri).toLowerCase() === '.apex';
const launchReplayDebuggerLogFile = async (sourceUri) => {
    await vscode.commands.executeCommand('sf.launch.replay.debugger.logfile', {
        fsPath: sourceUri.fsPath
    });
};
const IS_TEST_REG_EXP = /@isTest/i;
const getApexTestClassName = (document) => document.uri.fsPath.endsWith('.cls') && IS_TEST_REG_EXP.test(document.getText())
    ? (0, node_path_1.basename)(document.uri.fsPath, '.cls')
    : undefined;
const launchAnonymousApexReplayDebugger = async () => {
    if (!(await effect_ext_utils_1.sfProjectPreconditionChecker.check()))
        return;
    await vscode.commands.executeCommand('sf.anon.apex.debug.delegate');
};
const launchApexReplayDebugger = async (apexTestClassName) => {
    await vscode.commands.executeCommand('sf.test.view.debugTests', {
        name: apexTestClassName
    });
};
//# sourceMappingURL=launchApexReplayDebuggerWithCurrentFile.js.map