import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context";
import ChatBox from "./ChatBox";

const BASE_URL = import.meta.env.VITE_WS_SERVER;

// interface message {
//   type: string;
//   payload: payload;
// }

interface Payload {
  author: string;
  message: string;
  roomCode?: string;
}

interface WorldChatProps {
  setCurrentChatBox: (val: string) => void;
  currentChatBox: string;
}

const WorldChat = ({ setCurrentChatBox, currentChatBox }: WorldChatProps) => {
  const currentAuthor: string = useContext(UserContext);
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<Payload[]>([]);

  useEffect(() => {
    const ws = new WebSocket(BASE_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(
        `{"type": "JOIN_WORLD", "payload":{"author":"${currentAuthor}","message":"let me in"}}`
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage((prev) => [...prev, data]);
    };

    ws.onerror = (error) => {
      console.log("Websocket Connection Error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current?.readyState === 1) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-[90vh] max-h-[90vh] w-600px max-w-[90%] border border-white p-5 flex flex-col justify-end gap-2 rounded-lg">
      <ChatBox
        socketRef={socketRef}
        setCurrentChatBox={setCurrentChatBox}
        currentChatBox={currentChatBox}
        message={message}
      />
    </div>
  );
};

export default WorldChat;
