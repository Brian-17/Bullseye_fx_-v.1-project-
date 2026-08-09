"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageBroker = void 0;
const vscode = acquireVsCodeApi();
class MessageBroker {
    constructor() {
        this.currentToken = 1;
        this.queue = {};
        window.addEventListener('message', (event) => {
            const response = event.data;
            if (response.token) {
                this.queue[response.token](response);
                delete this.queue[response.token];
            }
        });
    }
    send(request) {
        return new Promise((resolve, reject) => {
            request.token = this.currentToken++;
            this.queue[request.token] = (result) => result.err ? reject(result.err) : resolve(result);
            vscode.postMessage(request);
        });
    }
    sendGetChildrenNames(request) {
        return new Promise((resolve, reject) => {
            request.token = this.currentToken++;
            this.queue[request.token] = (result) => (result.err ? reject(result.err) : resolve(result));
            vscode.postMessage(request);
        });
    }
}
exports.messageBroker = new MessageBroker();
//# sourceMappingURL=MessageBroker.js.map