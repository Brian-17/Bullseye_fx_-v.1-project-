"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchRadix = exports.CustomReset = exports.SuspendAllSession = exports.ResumeAllSession = exports.MemoryServer = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
/*********************************************************************
 * Copyright (c) 2018 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
const vscode_1 = require("vscode");
const MemoryServer_1 = require("./memory/server/MemoryServer");
var MemoryServer_2 = require("./memory/server/MemoryServer");
Object.defineProperty(exports, "MemoryServer", { enumerable: true, get: function () { return MemoryServer_2.MemoryServer; } });
const ResumeAllSession_1 = require("./ResumeAllSession");
var ResumeAllSession_2 = require("./ResumeAllSession");
Object.defineProperty(exports, "ResumeAllSession", { enumerable: true, get: function () { return ResumeAllSession_2.ResumeAllSession; } });
const SuspendAllSession_1 = require("./SuspendAllSession");
var SuspendAllSession_2 = require("./SuspendAllSession");
Object.defineProperty(exports, "SuspendAllSession", { enumerable: true, get: function () { return SuspendAllSession_2.SuspendAllSession; } });
const CustomReset_1 = require("./CustomReset");
var CustomReset_2 = require("./CustomReset");
Object.defineProperty(exports, "CustomReset", { enumerable: true, get: function () { return CustomReset_2.CustomReset; } });
const switchRadix_1 = require("./switchRadix");
var switchRadix_2 = require("./switchRadix");
Object.defineProperty(exports, "SwitchRadix", { enumerable: true, get: function () { return switchRadix_2.SwitchRadix; } });
const BreakpointModesController_1 = require("./BreakpointModesController");
const SourceFileHighlighting_1 = require("./SourceFileHighlighting");
function activate(context) {
    new MemoryServer_1.MemoryServer(context);
    new ResumeAllSession_1.ResumeAllSession(context);
    new SuspendAllSession_1.SuspendAllSession(context);
    new CustomReset_1.CustomReset(context);
    new switchRadix_1.SwitchRadix(context);
    new SourceFileHighlighting_1.SourceFileHighlighting(context).activate();
    context.subscriptions.push(vscode_1.commands.registerCommand('cdt.debug.askProgramPath', (_config) => {
        return vscode_1.window.showInputBox({
            placeHolder: 'Please enter the path to the program',
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('cdt.debug.askProcessId', (_config) => {
        return vscode_1.window.showInputBox({
            placeHolder: 'Please enter ID of process to attach to',
        });
    }));
    const breakpointModesController = new BreakpointModesController_1.BreakpointModesController(context);
    breakpointModesController.registerCommands();
}
function deactivate() {
    // empty, nothing to do on deactivating extension
}
//# sourceMappingURL=extension.js.map