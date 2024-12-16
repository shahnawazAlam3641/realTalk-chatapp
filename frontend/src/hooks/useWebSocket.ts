import { useEffect, useState } from "react";

interface payload {
  author: string;
  message: string;
}

export const useWebSocket = (url: string, body) => {
  const [socket, setSocket] = useState<WebSocket>();
  const [message, setMessage] = useState<payload[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send('{"type": "JOIN_WORLD"}'); // Send the initial message after connection
    };

    ws.onmessage = (event) => {
      console.log("INCOMING MESSAGE");
      // const message = JSON.parse(event.data);
      // console.log(typeof event.data);
      const message = event.data;

      setMessage((prev) => [...prev, message]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socket?.readyState === 1) {
        // <-- This is important
        socket.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { message, sendMessage };
};
