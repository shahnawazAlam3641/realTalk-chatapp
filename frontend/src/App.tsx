import { useState } from "react";
import Home from "./components/Home";
import "./App.css";
import WorldChat from "./components/WorldChat";
import UserContext from "./context";
import RoomChat from "./components/RoomChat";

function App() {
  const [currentChatBox, setCurrentChatBox] = useState("");
  const [currentTab, setCurrentTab] = useState("Join World Chat");
  const [roomCode, setRoomCode] = useState("");

  const [currentAuthor, setCurrentAuthor] = useState("");

  return (
    <UserContext.Provider value={currentAuthor}>
      <div className="relative min-h-screen min-w-[100vw] bg-[#212121] flex justify-center items-center">
        {/* home */}

        {currentChatBox == "" && (
          <Home
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            setCurrentAuthor={setCurrentAuthor}
            setCurrentChatBox={setCurrentChatBox}
          />
        )}

        {/* world Chat */}

        {currentChatBox == "World Chat" && (
          <WorldChat setCurrentChatBox={setCurrentChatBox} />
        )}

        {currentChatBox == "Room Chat" && (
          <RoomChat
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
            currentChatBox={currentChatBox}
            setCurrentChatBox={setCurrentChatBox}
          />
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
