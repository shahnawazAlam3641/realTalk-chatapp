import React, { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import UserContext from "../context";

interface payload {
  author: string;
  message: string;
  roomCode?: string;
}

const RoomChat = ({ setIsRoomChat, setCurrentChatBox, currentChatBox }) => {
  const currentAuthor = useContext(UserContext);
  const socketRef = useRef();
  const [message, setMessage] = useState<payload[]>([]);
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
      console.log("message sent on joining");
      ws.send(
        `{"type": "CREATE_ROOM", "payload":{"author":"${currentAuthor}","message":"let me in"}}`
      ); // Send the initial message after connection
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
    <div>
      <ChatBox
        roomCode={roomCode}
        currentChatBox={currentChatBox}
        socketRef={socketRef}
        message={message}
        setCurrentChatBox={setCurrentChatBox}
        setIsRoomChat={setIsRoomChat}
      />
    </div>
  );
};

export default RoomChat;
