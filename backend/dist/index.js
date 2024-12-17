"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const allSockets = new Map();
const rooms = new Map();
// wss.on("connection", (socket) => {
//   allSockets.push(socket);
//   console.log(allSockets.length);
// });
wss.on("connection", (socket) => {
    const uniqueId = Math.floor(Math.random() * 10000).toString();
    let currentUser;
    console.log(`Client connected with ID: ${uniqueId}`);
    console.log(`Total connected clients: ${allSockets.size}`);
    socket.on("message", (message) => {
        var _a, _b, _c, _d;
        try {
            console.log("first");
            console.log(message.toString());
            const parsedMessage = JSON.parse(message.toString());
            const { type, payload } = parsedMessage;
            const { author, sentMessage } = payload;
            currentUser = author;
            if (type == "USERNAME_VALIDATION_ROOM") {
                const { author, roomCode } = payload;
                const isUsernameTaken = (_a = rooms.get(roomCode)) === null || _a === void 0 ? void 0 : _a.has(author);
                socket.send(JSON.stringify({
                    type: "USERNAME_VALIDATION_ROOM",
                    payload: {
                        isUsernameTaken: isUsernameTaken,
                    },
                }));
                if (isUsernameTaken) {
                    socket.close();
                }
            }
            if (type == "CREATE_ROOM") {
                const roomCode = generateUniqueRoomCode();
                console.log(roomCode);
                if (!rooms.has(roomCode)) {
                    rooms.set(roomCode, new Map());
                    console.log(`Room created: ${roomCode}`);
                    socket.send(JSON.stringify({ type: "ROOM_CREATED", roomCode }));
                }
            }
            if (type == "JOIN_ROOM") {
                const { roomCode, author } = payload;
                if (rooms.has(roomCode)) {
                    (_b = rooms.get(roomCode)) === null || _b === void 0 ? void 0 : _b.set(author, socket);
                    console.log(`Client joined room: ${roomCode}`);
                    socket.send(JSON.stringify({ type: "ROOM_JOINED", roomCode }));
                }
                else {
                    socket.send(JSON.stringify({ type: "ERROR", message: "Room does not exist" }));
                }
            }
            if (type == "SEND_MESSAGE") {
                const { roomCode, message, author } = payload;
                console.log((_c = rooms.get(roomCode)) === null || _c === void 0 ? void 0 : _c.has(author));
                if ((_d = rooms.get(roomCode)) === null || _d === void 0 ? void 0 : _d.has(author)) {
                    console.log("condition passed");
                    rooms.get(roomCode).forEach((client) => {
                        // console.log(client);
                        if (client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify(payload));
                        }
                    });
                }
                else {
                    socket.send(JSON.stringify({
                        type: "ERROR",
                        message: "Room does not exist or you are not a member of room",
                    }));
                }
            }
            if (type == "USERNAME_VALIDATION_WORLD") {
                const { username } = payload;
                const isUsernameTaken = allSockets.has(username);
                socket.send(JSON.stringify({
                    type: "USERNAME_VALIDATION_WORLD",
                    payload: {
                        isUsernameTaken: isUsernameTaken,
                    },
                }));
                if (isUsernameTaken) {
                    socket.close();
                }
            }
            if (type == "JOIN_WORLD") {
                // const { author, message } = payload;
                if (allSockets.has(author)) {
                    socket.send("{'message':'username already exists'}");
                    return;
                }
                allSockets.set(author, socket);
                console.log(uniqueId + " WORLD CHAT JOINED");
            }
            if (type == "SEND_WORLD") {
                const { author, message } = payload;
                if (allSockets.has(author)) {
                    allSockets.forEach((s) => {
                        console.log(`"${author}":"${message}"`);
                        // s.send(`${author}: ${message}`);
                        s.send(`{"author":"${author}","message":"${message}"}`);
                    });
                }
                else {
                    socket.send("To send message to world chat please join world chat first");
                }
            }
        }
        catch (error) {
            console.log(error);
            socket.send("error occured while sending message to world chat");
        }
    });
    socket.on("close", () => {
        console.log("Client disconnected");
        if (allSockets.has(currentUser)) {
            allSockets.delete(currentUser);
        }
        // Remove the socket from all rooms
        rooms.forEach((clients, roomCode) => {
            if (clients.has(socket)) {
                clients.delete(socket);
                console.log(`Socket removed from room: ${roomCode}`);
                if (clients.size === 0) {
                    rooms.delete(roomCode);
                    console.log(`Room deleted: ${roomCode}`);
                }
            }
        });
    });
    socket.on("error", (error) => {
        console.error(`Error on socket ${currentUser}:`, error);
    });
});
function generateUniqueRoomCode() {
    let roomCode;
    do {
        roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (rooms.has(roomCode));
    return roomCode;
}
