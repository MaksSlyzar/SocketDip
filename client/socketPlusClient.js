class SocketPlusEvents extends EventEmitter {
    connection = false;

    constructor (link) {
        super();
        this.link = link;

        this.connect()
    }

    onConnection (ws) {
        this.connection = true;
    }

    onMessage (message) {
        const messageData = JSON.parse(message.data);
        this.emit(messageData.event, messageData.data);
    }

    connect () {
        this.wsConnection = new WebSocket(this.link);
        
        this.ws = this.wsConnection;

        if (!this.connection)
            setTimeout(() => {
                this.connect();
            }, 3000);
    }

    onClose (event) {
        this.connection = false;
        this.connect();
    }

    sendEmit (event, data) {
        this.ws.send(JSON.stringify({ event: event, data: data }));
    }
}

class SocketPlus {
    constructor (link) {
        globalThis.socketPlusEvents = new SocketPlusEvents(link);


        globalThis.socketPlusEvents.ws.onopen = function (ws) {
            globalThis.socketPlusEvents.onConnection(ws);
        }

        globalThis.socketPlusEvents.ws.onmessage = function (message) {
            globalThis.socketPlusEvents.onMessage(message);
        }

        globalThis.socketPlusEvents.ws.onclose = function (event) {
            globalThis.socketPlusEvents.onClose(event);
        }
    }

    on (event, _f) {
        globalThis.socketPlusEvents.on(event, _f);
    }

    sendEmit(event, data) {
        globalThis.socketPlusEvents.sendEmit(event, data);
    }
}
