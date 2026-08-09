/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
/*********************************************************************
 * Based on the theia-cpp-extension in Eclipse Theia under EPL-2.0
 *********************************************************************/
import * as React from 'react';
import { MemoryContents } from 'cdt-gdb-adapter';
import './MemoryBrowser.scss';
interface Props {
}
interface State {
    memory?: MemoryContents;
    error?: React.JSX.Element;
    bytesPerRow: number;
    bytesPerGroup: number;
    endianness: 'le' | 'be';
    childrenNames: {
        id: number;
        name: string;
    }[];
}
export declare class MemoryBrowser extends React.Component<Props, State> {
    private addressReq;
    private lengthReq;
    private childReq;
    static firstTime: boolean;
    constructor(props: Props);
    getAvailableChildren(): Promise<void>;
    sendReadMemoryRequest(): Promise<void>;
    onEndiannessChange(event: React.FormEvent<HTMLInputElement>): void;
    renderInputSection(): React.JSX.Element;
    private hex2bytes;
    private isprint;
    private renderRows;
    private renderMemory;
    render(): React.JSX.Element;
    renderChildName(): React.JSX.Element;
}
export {};
