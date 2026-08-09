"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arePathsEqual = void 0;
/*********************************************************************
 * Copyright (c) 2026 Renesas Electronics Corporation and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
/**
 * This function compares the given paths, returns true if they are equal.
 *
 * - The compare function normalises the paths before checking, which means '.' and '..' expressions
 *   reduced properly.
 * - For Windows, the compare function is case insensitive
 * - For Windows, the compare function also handles backslashes, forward slashes insensitively.
 * - Compare function handles undefined values, which means given paths can be undefined. No need to check
 *   undefined before sending the arguments.
 *
 * @param path1
 *      First path to compare
 * @param path2
 *      Second path to compare
 */
const arePathsEqual = (path1, path2) => {
    if (!path1 || !path2) {
        return path1 === path2;
    }
    const nPath1 = (0, node_path_1.normalize)(path1);
    const nPath2 = (0, node_path_1.normalize)(path2);
    return (0, node_os_1.platform)() === 'win32'
        ? nPath1.localeCompare(nPath2, undefined, { sensitivity: 'accent' }) ===
            0
        : nPath1 === nPath2;
};
exports.arePathsEqual = arePathsEqual;
//# sourceMappingURL=utils.js.map