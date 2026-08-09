"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakpointModesController = void 0;
/*********************************************************************
 * Copyright (c) 2026 Renesas Electronics Corporation and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
class BreakpointModesController {
    constructor(context) {
        this.context = context;
        this.setBreakpointHandler = (mode) => (values) => __awaiter(this, void 0, void 0, function* () {
            try {
                const line = values.lineNumber - 1;
                const existingBreakpoints = vscode_1.debug.breakpoints.filter((bp) => {
                    var _a, _b, _c, _d, _e;
                    return (0, utils_1.arePathsEqual)((_b = (_a = bp === null || bp === void 0 ? void 0 : bp.location) === null || _a === void 0 ? void 0 : _a.uri) === null || _b === void 0 ? void 0 : _b.path, values.uri.path) && ((_e = (_d = (_c = bp === null || bp === void 0 ? void 0 : bp.location) === null || _c === void 0 ? void 0 : _c.range) === null || _d === void 0 ? void 0 : _d.start) === null || _e === void 0 ? void 0 : _e.line) === line;
                });
                if (existingBreakpoints.length) {
                    const existingBreakpointHasDesiredMode = existingBreakpoints.findIndex((bp) => bp.mode === mode) > -1;
                    if (existingBreakpointHasDesiredMode) {
                        return;
                    }
                    vscode_1.debug.removeBreakpoints(existingBreakpoints);
                }
                const sp = new vscode_1.SourceBreakpoint(new vscode_1.Location(values.uri, new vscode_1.Position(line, 0)));
                // Limitation of VS Code: https://github.com/microsoft/vscode/issues/304764
                // This is a workaround to inject 'mode' into VS Code breakpoint object.
                // This injection functionally working as expected and passes the information
                // correctly through DAP messages, however the breakpoint mode information is not
                // visible in the breakpoint list window
                sp.mode = mode;
                vscode_1.debug.addBreakpoints([sp]);
            }
            catch (e) {
                vscode_1.window.showErrorMessage(`Failed to set ${mode} breakpoint: ${e}`);
            }
        });
        this.registerCommands = () => {
            this.context.subscriptions.push(vscode_1.commands.registerCommand('cdt.debug.breakpoints.addHardwareBreakpoint', this.setBreakpointHandler('hardware')));
            this.context.subscriptions.push(vscode_1.commands.registerCommand('cdt.debug.breakpoints.addSoftwareBreakpoint', this.setBreakpointHandler('software')));
        };
    }
}
exports.BreakpointModesController = BreakpointModesController;
//# sourceMappingURL=BreakpointModesController.js.map