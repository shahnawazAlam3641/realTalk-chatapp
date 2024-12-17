import { useContext, useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import UserContext from "../context";

interface message {
  type: string;
  payload: payload;
}

interface payload {
  author: string;
  message: string;
}

const WorldChat = ({ setIsWorldChat }) => {
  const currentAuthor: string = useContext(UserContext);
  console.log(typeof currentAuthor);
  const inputRef = useRef(null);
  // const { message, sendMessage } = useWebSocket("ws://localhost:8080");
  // const [socket, setSocket] = useState<WebSocket>();
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<payload[]>([]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
      socketRef.current?.send(JSON.stringify(message));
    }
  };

  const handleSendMessage = () => {
    sendMessage({
      type: "SEND_WORLD",
      payload: {
        author: currentAuthor,
        message: inputRef.current?.value,
      },
    });
    inputRef.current.value = "";
  };

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
      <div className="max-h-[90%] flex flex-col gap-2 overflow-y-auto">
        {message.map((mess, index) => {
          return (
            <p
              key={index}
              className={`p-1 bg-white rounded-sm w-fit max-w-[80%] flex flex-col ${
                mess.author == currentAuthor
                  ? "ml-auto bg-[#515151] text-white"
                  : ""
              }`}
            >
              {mess.author !== currentAuthor && (
                <span className="underline text-xs">{mess.author}:</span>
              )}
              <span>{mess.message}</span>
            </p>
          );
        })}
      </div>
      <div className="flex gap-1 h-[10%]">
        <input
          ref={inputRef}
          placeholder="Type message"
          className="rounded-md px-5 w-full"
        />
        <button
          onClick={() =>
            // console.log(`{"type": "SEND_WORLD", "payload":{"author":"shaha","message":${inputRef.current?.value}}}`)
            handleSendMessage()
          }
          className="p-2 bg-white rounded-md"
        >
          Send
        </button>
        <button
          onClick={() => setIsWorldChat(false)}
          className="p-2 bg-red-400 text-[#212121] rounded-md "
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default WorldChat;
