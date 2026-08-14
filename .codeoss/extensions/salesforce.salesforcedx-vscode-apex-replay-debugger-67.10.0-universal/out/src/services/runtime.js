"use strict";
/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntime = void 0;
const ManagedRuntime = require("effect/ManagedRuntime");
const extensionProvider_1 = require("./extensionProvider");
const createReplayDebuggerRuntime = () => ManagedRuntime.make(extensionProvider_1.AllServicesLayer);
let _replayDebuggerRuntime;
const getRuntime = () => {
    _replayDebuggerRuntime ??= createReplayDebuggerRuntime();
    return _replayDebuggerRuntime;
};
exports.getRuntime = getRuntime;
//# sourceMappingURL=runtime.js.map