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
exports.SourceFileHighlighting = void 0;
const vscode = require("vscode");
class SourceFileHighlighting {
    constructor(context) {
        this.highlightingEnabled = vscode.workspace
            .getConfiguration()
            .get('cdt.debug.sourceHighlighting', true);
        this.executableLineDecorator = vscode.window.createTextEditorDecorationType({
            light: { backgroundColor: '#d2e2e54d' },
            dark: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            isWholeLine: true,
        });
        this.context = context;
    }
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerToEvents();
            this.registerCommands();
            yield vscode.commands.executeCommand('setContext', 'cdt.debug.sourceCodeHighlightingEnabled', this.highlightingEnabled);
        });
    }
    registerToEvents() {
        const onDidChangeActiveDebugSessionDisposable = vscode.debug.onDidChangeActiveDebugSession((session) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleOnDidChangeActiveDebugSession(session);
        }));
        const onDidChangeActiveTextEditorDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleOnDidChangeActiveTextEditor(editor);
        }));
        const onDidChangeConfigurationDisposable = vscode.workspace.onDidChangeConfiguration((event) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleOnDidChangeConfiguration(event);
        }));
        this.context.subscriptions.push(onDidChangeActiveDebugSessionDisposable, onDidChangeActiveTextEditorDisposable, onDidChangeConfigurationDisposable);
    }
    registerCommands() {
        const onEnableSourceFileHighlightingCommandDisposable = vscode.commands.registerCommand('cdt.debug.enableSourceCodeHighlighting', () => __awaiter(this, void 0, void 0, function* () {
            yield this.handleEnableSourceFileHighlighting();
        }));
        const onDisableSourceFileHighlightingCommandDisposable = vscode.commands.registerCommand('cdt.debug.disableSourceCodeHighlighting', () => __awaiter(this, void 0, void 0, function* () {
            yield this.handleDisableSourceFileHighlighting();
        }));
        this.context.subscriptions.push(onEnableSourceFileHighlightingCommandDisposable, onDisableSourceFileHighlightingCommandDisposable);
    }
    handleOnDidChangeConfiguration(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.affectsConfiguration('cdt.debug.sourceHighlighting')) {
                this.highlightingEnabled = vscode.workspace
                    .getConfiguration()
                    .get('cdt.debug.sourceHighlighting', true);
                if (!this.highlightingEnabled) {
                    this.clearExecutableLineDecorations(vscode.window.visibleTextEditors);
                }
                else {
                    yield this.handleOnDidChangeActiveTextEditor(vscode.window.activeTextEditor);
                }
                yield vscode.commands.executeCommand('setContext', 'cdt.debug.sourceCodeHighlightingEnabled', this.highlightingEnabled);
            }
        });
    }
    handleEnableSourceFileHighlighting() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.activeDebugSession) {
                return;
            }
            this.highlightingEnabled = true;
            yield this.handleOnDidChangeActiveTextEditor(vscode.window.activeTextEditor);
            yield vscode.commands.executeCommand('setContext', 'cdt.debug.sourceCodeHighlightingEnabled', true);
            yield vscode.workspace
                .getConfiguration()
                .update('cdt.debug.sourceHighlighting', true, vscode.ConfigurationTarget.Workspace);
        });
    }
    handleDisableSourceFileHighlighting() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearExecutableLineDecorations(vscode.window.visibleTextEditors);
            this.highlightingEnabled = false;
            yield vscode.commands.executeCommand('setContext', 'cdt.debug.sourceCodeHighlightingEnabled', false);
            yield vscode.workspace
                .getConfiguration()
                .update('cdt.debug.sourceHighlighting', false, vscode.ConfigurationTarget.Workspace);
        });
    }
    clearExecutableLineDecorations(editors) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const editor of editors) {
                editor.setDecorations(this.executableLineDecorator, []);
            }
            yield vscode.commands.executeCommand('setContext', 'cdt.debug.sourceCodeHighlightingEnabled', false);
        });
    }
    handleOnDidChangeActiveTextEditor(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor) {
                return;
            }
            if (!this.highlightingEnabled || !this.activeDebugSession) {
                yield this.clearExecutableLineDecorations([editor]);
                return;
            }
            const breakpointLocations = yield this.getBreakpointLocations(editor);
            if (!breakpointLocations) {
                yield this.clearExecutableLineDecorations([editor]);
                return;
            }
            const executableLines = new Set(breakpointLocations.breakpoints.map((bp) => bp.line));
            const decorations = Array.from(executableLines).map((exeline) => {
                const line = exeline - 1; // Convert to 0-based index
                return {
                    range: new vscode.Range(line, 0, line, 0),
                };
            });
            editor.setDecorations(this.executableLineDecorator, decorations);
        });
    }
    handleOnDidChangeActiveDebugSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!session) {
                yield this.handleSessionInActive();
                return;
            }
            if (session.type !== 'gdb' && session.type !== 'gdbtarget') {
                yield this.handleSessionInActive();
                return;
            }
            this.activeDebugSession = session;
            vscode.commands.executeCommand('setContext', 'cdt.debug.sourceCodeHighlightingEnabled', this.highlightingEnabled);
            yield this.handleOnDidChangeActiveTextEditor(vscode.window.activeTextEditor);
        });
    }
    handleSessionInActive() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clearExecutableLineDecorations(vscode.window.visibleTextEditors);
            return;
        });
    }
    getBreakpointLocations(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (editor.document.uri.scheme !== 'file') {
                return;
            }
            const currentSourceFile = editor.document.fileName;
            const args = {
                source: { path: currentSourceFile },
                line: 1,
                endLine: editor.document.lineCount, // Requesting breakpoint locations for the whole file
            };
            const breakpointLocations = yield ((_a = this.activeDebugSession) === null || _a === void 0 ? void 0 : _a.customRequest('breakpointLocations', args));
            return breakpointLocations;
        });
    }
}
exports.SourceFileHighlighting = SourceFileHighlighting;
//# sourceMappingURL=SourceFileHighlighting.js.map