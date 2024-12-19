import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context";
import ChatBox from "./ChatBox";

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
  console.log(typeof currentAuthor);
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<Payload[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send(
        `{"type": "JOIN_WORLD", "payload":{"author":"${currentAuthor}","message":"let me in"}}`
      );
      console.log("message sent on joining");
    };

    ws.onmessage = (event) => {
      console.log(typeof event.data);
      console.log(event.data);

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
