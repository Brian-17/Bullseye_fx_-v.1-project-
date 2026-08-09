/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { ReadMemory, GetChildDapNames } from '../common/messages';
declare class MessageBroker {
    private currentToken;
    private queue;
    constructor();
    send(request: ReadMemory.Request): Promise<ReadMemory.Response>;
    sendGetChildrenNames(request: any): Promise<GetChildDapNames.Response>;
}
export declare const messageBroker: MessageBroker;
export {};
