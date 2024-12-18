import { useContext, useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import UserContext from "../context";
import ChatBox from "./ChatBox";

interface message {
  type: string;
  payload: payload;
}

interface payload {
  author: string;
  message: string;
}

const WorldChat = ({ setCurrentChatBox, currentChatBox }) => {
  const currentAuthor: string = useContext(UserContext);
  console.log(typeof currentAuthor);
  // const inputRef = useRef(null);
  // const { message, sendMessage } = useWebSocket("ws://localhost:8080");
  // const [socket, setSocket] = useState<WebSocket>();
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<payload[]>([]);

  // const sendMessage = (message) => {
  //   if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
  //     socketRef.current?.send(JSON.stringify(message));
  //   }
  // };

  // const handleSendMessage = () => {
  //   if (inputRef.current.value == "") {
  //     return;
  //   } else {
  //     sendMessage({
  //       type: "SEND_WORLD",
  //       payload: {
  //         author: currentAuthor,
  //         message: inputRef.current?.value,
  //       },
  //     });
  //     inputRef.current.value = "";
  //   }
  // };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send(
        `{"type": "JOIN_WORLD", "payload":{"author":"${currentAuthor}","message":"let me in"}}`
      ); // Send the initial message after connection
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
