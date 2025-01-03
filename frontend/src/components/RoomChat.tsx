import { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import UserContext from "../context";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_WS_SERVER;

interface payload {
  author: string;
  message: string;
  roomCode?: string;
}

interface RoomChatProps {
  setCurrentChatBox: (val: string) => void;
  currentChatBox: string;
  currentTab: string;
  roomCode: string;
  setRoomCode: (val: string) => void;
}

const RoomChat = ({
  setCurrentChatBox,
  currentChatBox,
  currentTab,
  roomCode,
  setRoomCode,
}: RoomChatProps) => {
  const currentAuthor = useContext(UserContext);
  const socketRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<payload[]>([]);

  useEffect(() => {
    const ws = new WebSocket(BASE_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      if (currentTab == "Create Room") {
        ws.send(
          `{"type": "CREATE_ROOM", "payload":{"author":"${currentAuthor}","message":"let me in"}}`
        ); // Send the initial message after connection
      } else if (currentTab == "Join Room") {
        ws.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            payload: { author: currentAuthor, roomCode: roomCode },
          })
        );
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type == "ERROR") {
        toast.error(data.message);
        return;
      }

      if (data.type == "ROOM_CREATED") {
        setRoomCode(data.roomCode);
        socketRef.current?.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            payload: { author: currentAuthor, roomCode: data.roomCode },
          })
        );

        if (data.type == "ROOM_JOINED") {
          setCurrentChatBox("Room Chat");
        }
      }

      if (data.author && data.roomCode && data.message) {
        setMessage((prev) => [...prev, data]);
      }
    };

    ws.onerror = (error) => {
      console.log("Websocket Connection Error: ", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current?.readyState === 1) {
        socketRef.current?.close();
      }
    };
  }, []);
  return (
    <div className="min-h-[90vh] max-h-[90vh] w-600px max-w-[90%] border border-white p-5 flex flex-col justify-between gap-2 rounded-lg">
      <div
        onClick={() => {
          navigator.clipboard.writeText(roomCode);
          toast.success("Room Code copied to clipboard");
        }}
        className="text-lg font-bold flex gap-3 p-2 hover:bg-[#313131] w-fit rounded-md text-white cursor-pointer "
        title="Click to Copy"
      >
        Room Code: <span>{roomCode}</span>
      </div>
      <ChatBox
        roomCode={roomCode}
        currentChatBox={currentChatBox}
        socketRef={socketRef}
        message={message}
        setCurrentChatBox={setCurrentChatBox}
      />
    </div>
  );
};

export default RoomChat;
