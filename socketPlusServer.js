const WebSocket = require('ws');
const EventEmitter = require('events');

class SocketPlus extends EventEmitter {
    sockets = {}

    constructor (server) {
        super();

        this.webSocketServer = new WebSocket.Server({ server });

        this.webSocketServer.on('connection', ws => {
            const newSocketID = Math.round(Math.random() * 100000000000);
            const socket = new Socket(newSocketID, ws);

            this.sockets[newSocketID] = socket;

            socket.sendEmit('connection', 'Привіт!');

            this.emit('connection', socket);

            ws.on('message', (message) => {
                const messageData = JSON.parse(message);
                socket.emit(messageData.event, messageData.data);
            });
         
            ws.on("error", e => ws.send(e));
         });
    }

    send () {
        //Send all sockets
    }

    getAllSockets () {

    }
}

class Socket extends EventEmitter {
    constructor (id, ws) {
        super();

        this.id = id;
        this.ws = ws;
    }

    sendEmit (event, data) {
        this.ws.send(JSON.stringify({ event: event, data: data }));
    }
}


module.exports = SocketPlus;