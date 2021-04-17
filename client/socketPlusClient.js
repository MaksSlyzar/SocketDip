class SocketPlusEvents extends EventEmitter {
    constructor (link) {
        super();
    }

    onConnection (ws) {
        this.ws = ws;
    }

    onMessage (message) {
        const messageData = JSON.parse(message.data);
        this.emit(messageData.event, messageData.data);
    }

    sendEmit (event, data) {
        this.ws.send(JSON.stringify({ event: event, data: data }));
    }
}

class SocketPlus {
    constructor (link) {
        globalThis.socketPlusEvents = new SocketPlusEvents(link);

        this.wsConnection = new WebSocket(link);
        
        globalThis.socketPlusEvents.ws = this.wsConnection;

        this.wsConnection.onopen = function (ws) {
            //globalThis.socketPlusEvents.onConnection(ws);
        }

        this.wsConnection.onmessage = function (message) {
            globalThis.socketPlusEvents.onMessage(message);
        }
    }

    on (event, _f) {
        globalThis.socketPlusEvents.on(event, _f);
    }

    sendEmit(event, data) {
        globalThis.socketPlusEvents.sendEmit(event, data);
    }
}
