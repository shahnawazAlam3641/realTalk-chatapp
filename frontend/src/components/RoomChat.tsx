import React, { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import UserContext from "../context";

interface payload {
  author: string;
  message: string;
  roomCode?: string;
}

const RoomChat = ({
  setCurrentChatBox,
  currentChatBox,
  currentTab,
  roomCode,
  setRoomCode,
  setCurrentTab,
}) => {
  const currentAuthor = useContext(UserContext);
  const socketRef = useRef();
  const [message, setMessage] = useState<payload[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
      console.log("message sent on joining");
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
      console.log("message sent on joining");
    };

    ws.onmessage = (event) => {
      console.log(typeof event.data);
      console.log(event.data);

      const data = JSON.parse(event.data);

      if (data.type == "ROOM_CREATED") {
        console.log(data);
        setRoomCode(data.roomCode);
        socketRef.current?.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            payload: { author: currentAuthor, roomCode: data.roomCode },
          })
        );

        if (data.type == "ROOM_JOINED") {
          console.log("Room Joined Successfully");
          setCurrentChatBox("Room Chat");
        }
      } else {
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
    <div className="min-h-[90vh] max-h-[90vh] w-600px max-w-[90%] border border-white p-5 flex flex-col justify-end gap-2 rounded-lg">
      <ChatBox
        roomCode={roomCode}
        currentChatBox={currentChatBox}
        socketRef={socketRef}
        message={message}
        setCurrentChatBox={setCurrentChatBox}
        // setIsRoomChat={setIsRoomChat}
      />
    </div>
  );
};

export default RoomChat;
