import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const allSockets = new Map();

const rooms = new Map();

// wss.on("connection", (socket) => {
//   allSockets.push(socket);
//   console.log(allSockets.length);
// });

wss.on("connection", (socket) => {
  const uniqueId = Math.floor(Math.random() * 10000).toString();

  console.log(`Client connected with ID: ${uniqueId}`);
  console.log(`Total connected clients: ${allSockets.size}`);

  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

      const { type, payload } = parsedMessage;

      if (type == "CREATE_ROOM") {
        const roomCode = generateUniqueRoomCode();

        if (!rooms.has(roomCode)) {
          rooms.set(roomCode, new Set([socket]));
          console.log(`Room created: ${roomCode}`);
          socket.send(JSON.stringify({ type: "ROOM_CREATED", roomCode }));
        }
      }

      if (type == "JOIN_ROOM") {
        const { roomCode } = payload;

        if (rooms.has(roomCode)) {
          rooms.get(roomCode).add(socket);
          console.log(`Client joined room: ${roomCode}`);
          socket.send(JSON.stringify({ type: "ROOM_JOINED", roomCode }));
        } else {
          socket.send(
            JSON.stringify({ type: "ERROR", message: "Room does not exist" })
          );
        }
      }

      if (type == "SEND_MESSAGE") {
        const { roomCode, message } = payload;

        if (rooms.get(roomCode)?.has(socket)) {
          rooms.get(roomCode).forEach((client: any) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
        } else {
          socket.send(
            JSON.stringify({
              type: "ERROR",
              message: "Room does not exist or you are not a member of room",
            })
          );
        }
      }

      if (type == "JOIN_WORLD") {
        const { author, message } = payload;
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
            s.send(`${author}: ${message}`);
          });
        } else {
          socket.send(
            "To send message to world chat please join world chat first"
          );
        }
      }
    } catch (error) {
      console.log(error);
      socket.send("error occured");
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
    if (allSockets.has(uniqueId)) {
      allSockets.delete(uniqueId);
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
    console.error(`Error on socket ${uniqueId}:`, error);
  });
});

function generateUniqueRoomCode(): string {
  let roomCode: string;
  do {
    roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (rooms.has(roomCode));
  return roomCode;
}
