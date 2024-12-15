import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const allSockets = new Map();

// wss.on("connection", (socket) => {
//   allSockets.push(socket);
//   console.log(allSockets.length);
// });

wss.on("connection", (socket) => {
  const uniqueId = Math.floor(Math.random() * 10000).toString();

  allSockets.set(uniqueId, socket);

  console.log(`Client connected with ID: ${uniqueId}`);
  console.log(`Total connected clients: ${allSockets.size}`);

  socket.on("message", (message) => {
    try {
      // @ts-ignore
      const parsedMessage = JSON.parse(message);

      allSockets.forEach((s) => {
        s.send(parsedMessage.message);
      });
    } catch (error) {
      console.log(error);
      socket.send("error occured");
    }
  });

  socket.on("close", () => {
    console.log(`Client disconnected with ID: ${uniqueId}`);
    allSockets.delete(uniqueId);
    console.log(`Total connected clients: ${allSockets.size}`);
  });

  // Handle socket errors
  socket.on("error", (error) => {
    console.error(`Error on socket ${uniqueId}:`, error);
  });
});
