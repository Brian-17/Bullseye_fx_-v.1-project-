/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { MemoryRequestArguments, MemoryContents } from 'cdt-gdb-adapter';
import { ChildDapContents } from 'cdt-amalgamator';
export declare namespace Message {
    interface Request {
        token?: number;
    }
    interface Response {
        token?: number;
        err?: string;
    }
}
export interface MemoryAmalgamatorRequestArguments extends MemoryRequestArguments {
    child?: number;
}
export declare namespace ReadMemory {
    interface Request extends Message.Request {
        command: 'ReadMemory';
        args: MemoryAmalgamatorRequestArguments;
    }
    interface Response extends Message.Response {
        command: 'ReadMemory';
        result?: MemoryContents;
    }
}
export declare namespace GetChildDapNames {
    interface Request extends Message.Request {
        command: 'getChildDapNames';
    }
    interface Response extends Message.Response {
        command: 'getChildDapNames';
        result?: ChildDapContents;
    }
}
export type ClientRequest = ReadMemory.Request;
export type ServerResponse = ReadMemory.Response;
export type ChildDapNamesClientRequest = GetChildDapNames.Request;
export type ChildDapNamesServerResponse = GetChildDapNames.Response;
