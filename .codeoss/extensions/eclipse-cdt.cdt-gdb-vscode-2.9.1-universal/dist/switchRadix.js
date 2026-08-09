"use strict";
/*********************************************************************
 * Copyright (c) 2026 Arm Limited and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
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
exports.SwitchRadix = void 0;
const vscode = require("vscode");
class SwitchRadix {
    constructor(context) {
        this._sessionsMap = new Map();
        vscode.debug.onDidChangeActiveDebugSession((session) => this.setCurrentRadixContext(session));
        vscode.debug.onDidStartDebugSession((session) => this.addCurrentRadixContext(session));
        vscode.debug.onDidTerminateDebugSession((session) => this._sessionsMap.delete(session.id));
        vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'decimal');
        vscode.debug.onDidReceiveDebugSessionCustomEvent((event) => this.handleOnDidReceiveCustomEvent(event));
        this.registerCommands(context);
    }
    handleOnDidReceiveCustomEvent(event) {
        if (event.session.type === 'gdb' ||
            event.session.type === 'gdbtarget') {
            if (event.event === 'OutputRadixUpdated') {
                if (event.body.radix === '16' || event.body.radix === '10') {
                    const radix = event.body.radix === '16' ? 'hexadecimal' : 'decimal';
                    this._sessionsMap.set(event.session.id, radix);
                    vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', radix);
                }
                else {
                    vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'others');
                    this._sessionsMap.set(event.session.id, 'others');
                }
            }
        }
    }
    addCurrentRadixContext(session) {
        if (!this._sessionsMap.has(session.id)) {
            this._sessionsMap.set(session.id, 'decimal');
            vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'decimal');
        }
    }
    setCurrentRadixContext(session) {
        if (!session) {
            return;
        }
        // Check if the session is already in the map
        const existingSessionRadix = this._sessionsMap.get(session.id);
        if (existingSessionRadix) {
            vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', existingSessionRadix);
            return;
        }
    }
    registerCommands(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const setOutputRadixToHexCommand = vscode.commands.registerCommand('cdt.debug.setOutputRadixToHex', () => __awaiter(this, void 0, void 0, function* () {
                yield this.handleSetOutputRadix('hexadecimal');
                const activeSession = vscode.debug.activeDebugSession;
                if (activeSession) {
                    this._sessionsMap.set(activeSession.id, 'hexadecimal');
                }
                yield vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'hexadecimal');
            }));
            const setOutputRadixToDecimalCommand = vscode.commands.registerCommand('cdt.debug.setOutputRadixToDecimal', () => __awaiter(this, void 0, void 0, function* () {
                yield this.handleSetOutputRadix('decimal');
                const activeSession = vscode.debug.activeDebugSession;
                if (activeSession) {
                    this._sessionsMap.set(activeSession.id, 'decimal');
                }
                yield vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'decimal');
            }));
            context.subscriptions.push(setOutputRadixToHexCommand, setOutputRadixToDecimalCommand);
        });
    }
    handleSetOutputRadix(radix) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeSession = vscode.debug.activeDebugSession;
            const args = {
                expression: `> set output-radix ${radix === 'hexadecimal' ? 16 : 10}`,
                context: 'repl',
            };
            try {
                yield (activeSession === null || activeSession === void 0 ? void 0 : activeSession.customRequest('evaluate', args));
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to set output radix to ${radix}: ${error}`);
            }
        });
    }
}
exports.SwitchRadix = SwitchRadix;
//# sourceMappingURL=switchRadix.js.map