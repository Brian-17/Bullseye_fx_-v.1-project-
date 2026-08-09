"use strict";
/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.MemoryBrowser = void 0;
/*********************************************************************
 * Based on the theia-cpp-extension in Eclipse Theia under EPL-2.0
 *********************************************************************/
const React = __importStar(require("react"));
require("./MemoryBrowser.scss");
const MessageBroker_1 = require("./MessageBroker");
class ForwardIterator {
    constructor(array) {
        this.array = array;
        this.nextItem = 0;
    }
    next() {
        if (this.nextItem < this.array.length) {
            return {
                value: this.array[this.nextItem++],
                done: false,
            };
        }
        else {
            return {
                done: true,
                value: 0,
            };
        }
    }
    [Symbol.iterator]() {
        return this;
    }
}
class ReverseIterator {
    constructor(array) {
        this.array = array;
        this.nextItem = this.array.length - 1;
    }
    next() {
        if (this.nextItem >= 0) {
            return {
                value: this.array[this.nextItem--],
                done: false,
            };
        }
        else {
            return {
                done: true,
                value: 0,
            };
        }
    }
    [Symbol.iterator]() {
        return this;
    }
}
class MemoryBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.addressReq = '';
        this.lengthReq = '512';
        this.childReq = 0;
        this.state = {
            bytesPerRow: 32,
            bytesPerGroup: 8,
            endianness: 'le',
            childrenNames: [],
        };
    }
    getAvailableChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const result = yield MessageBroker_1.messageBroker.sendGetChildrenNames({
                    command: 'getChildDapNames',
                });
                const childrenNames = ((_b = (_a = result.result) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.map((val, index) => {
                    return { id: index, name: val };
                })) || [];
                this.setState({
                    childrenNames: childrenNames,
                });
            }
            catch (_c) {
                this.setState({
                    childrenNames: [],
                });
            }
        });
    }
    sendReadMemoryRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.addressReq) {
                this.setState({ error: React.createElement("h3", null, "No address") });
            }
            else {
                try {
                    this.setState({
                        error: undefined,
                        memory: undefined,
                    });
                    const result = yield MessageBroker_1.messageBroker.send({
                        command: 'ReadMemory',
                        args: {
                            address: this.addressReq,
                            length: parseInt(this.lengthReq),
                            child: this.state.childrenNames.length ? this.childReq : undefined,
                        },
                    });
                    this.setState({ memory: result.result });
                }
                catch (err) {
                    this.setState({ error: React.createElement("h3", null, err + '') });
                }
            }
        });
    }
    onEndiannessChange(event) {
        const value = event.currentTarget.value;
        if (value === 'le' || value === 'be') {
            this.setState({ endianness: value });
        }
    }
    renderInputSection() {
        return (React.createElement("div", { className: "group" },
            React.createElement("div", { className: "input-group" },
                React.createElement("label", null, "Location"),
                React.createElement("input", { type: "text", size: 30, title: "Memory Location to display, an address or expression evaluating to an address", placeholder: "location...", onChange: (event) => (this.addressReq = event.target.value) })),
            React.createElement("div", { className: "input-group" },
                React.createElement("label", null, "Length"),
                React.createElement("input", { type: "text", size: 6, title: "Number of bytes to fetch, in decimal or hexadecimal", defaultValue: this.lengthReq, onChange: (event) => (this.lengthReq = event.target.value) })),
            this.renderChildName(),
            React.createElement("div", { className: "input-group" },
                React.createElement("button", { onClick: () => this.sendReadMemoryRequest() }, "Go")),
            React.createElement("div", { style: { width: '30px' } }),
            React.createElement("div", { className: "input-group" },
                React.createElement("label", null, "Bytes Per Row"),
                React.createElement("select", { defaultValue: "32", onChange: (event) => this.setState({ bytesPerRow: parseInt(event.target.value) }) },
                    React.createElement("option", { value: "16" }, "16"),
                    React.createElement("option", { value: "32" }, "32"),
                    React.createElement("option", { value: "64" }, "64"))),
            React.createElement("div", { className: "input-group" },
                React.createElement("label", null, "Bytes Per Group"),
                React.createElement("select", { defaultValue: "8", onChange: (event) => this.setState({ bytesPerGroup: parseInt(event.target.value) }) },
                    React.createElement("option", { value: "1" }, "1"),
                    React.createElement("option", { value: "2" }, "2"),
                    React.createElement("option", { value: "4" }, "4"),
                    React.createElement("option", { value: "8" }, "8"),
                    React.createElement("option", { value: "16" }, "16"))),
            React.createElement("div", { className: "input-group" },
                React.createElement("label", null,
                    React.createElement("input", { type: "radio", value: "le", name: "endianness", defaultChecked: true, onChange: (event) => this.onEndiannessChange(event) }),
                    "Little Endian"),
                React.createElement("label", null,
                    React.createElement("input", { type: "radio", value: "be", name: "endianness", defaultChecked: false, onChange: (event) => this.onEndiannessChange(event) }),
                    "Big Endian"))));
    }
    hex2bytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length / 2; i++) {
            const hexByte = hex.slice(i * 2, (i + 1) * 2);
            const byte = parseInt(hexByte, 16);
            bytes[i] = byte;
        }
        return bytes;
    }
    isprint(byte) {
        return byte >= 32 && byte < 127;
    }
    renderRows() {
        if (!this.state.memory) {
            return undefined;
        }
        const bytes = this.hex2bytes(this.state.memory.data);
        const address = parseInt(this.state.memory.address, 16);
        const rows = [];
        for (let rowOffset = 0; rowOffset < bytes.length; rowOffset += this.state.bytesPerRow) {
            const rowBytes = bytes.subarray(rowOffset, rowOffset + this.state.bytesPerRow);
            const addressStr = '0x' + (address + rowOffset).toString(16);
            const data = [];
            let asciiStr = '';
            for (let groupOffset = 0; groupOffset < rowBytes.length; groupOffset += this.state.bytesPerGroup) {
                const groupBytes = rowBytes.subarray(groupOffset, groupOffset + this.state.bytesPerGroup);
                let groupStr = '';
                const iteratorType = this.state.endianness == 'be' ? ForwardIterator : ReverseIterator;
                for (const byte of new iteratorType(groupBytes)) {
                    const byteStr = byte.toString(16);
                    if (byteStr.length == 1) {
                        groupStr += '0';
                    }
                    groupStr += byteStr;
                }
                data.push(groupStr);
                for (const byte of groupBytes) {
                    asciiStr += this.isprint(byte) ? String.fromCharCode(byte) : '.';
                }
            }
            rows.push(React.createElement("tr", { key: rowOffset },
                React.createElement("td", { className: "monofont", key: `addr${rowOffset}` }, addressStr),
                data.map((group, index) => (React.createElement("td", { className: "monofont", key: `data${rowOffset},${index}` }, group))),
                React.createElement("td", { className: "monofont", key: `asc${rowOffset}` }, asciiStr)));
        }
        return React.createElement(React.Fragment, null, rows);
    }
    renderMemory() {
        if (!this.state.memory) {
            return undefined;
        }
        return (React.createElement("div", null,
            React.createElement("table", null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Address"),
                        React.createElement("th", { colSpan: this.state.bytesPerRow / this.state.bytesPerGroup }, "Data"),
                        React.createElement("th", null, "ASCII"))),
                React.createElement("tbody", null, this.renderRows()))));
    }
    render() {
        return (React.createElement("div", { id: "memory-browser" },
            this.renderInputSection(),
            React.createElement("hr", { className: "seperator" }),
            this.state.error,
            this.renderMemory()));
    }
    renderChildName() {
        if (MemoryBrowser.firstTime) {
            this.getAvailableChildren();
            MemoryBrowser.firstTime = false;
        }
        const { childrenNames } = this.state;
        const childrenNamesList = childrenNames.length > 0 &&
            childrenNames.map((item, i) => {
                return (React.createElement("option", { key: i, value: item.id }, item.name));
            }, this);
        if (childrenNames.length > 0) {
            return (React.createElement("div", { className: "input-group" },
                React.createElement("label", null, "Child"),
                React.createElement("select", { defaultValue: this.childReq, onChange: (event) => (this.childReq = event.target.selectedIndex) }, childrenNamesList)));
        }
        else {
            return React.createElement("p", null);
        }
    }
}
exports.MemoryBrowser = MemoryBrowser;
MemoryBrowser.firstTime = true;
//# sourceMappingURL=MemoryBrowser.js.map