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
            setRoomCode={setRoomCode}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            setCurrentAuthor={setCurrentAuthor}
            setCurrentChatBox={setCurrentChatBox}
          />
        )}

        {/* world Chat */}

        {currentChatBox == "World Chat" && (
          <WorldChat
            setCurrentChatBox={setCurrentChatBox}
            currentChatBox={currentChatBox}
          />
        )}

        {currentChatBox == "Room Chat" && (
          <RoomChat
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            currentTab={currentTab}
            currentChatBox={currentChatBox}
            setCurrentChatBox={setCurrentChatBox}
          />
        )}
      </div>

      <div className="flex justify-between absolute bottom-0 w-full p-2">
        <span className="text-xs text-white">
          Built with 🤍 by Shahnawaz Alam
        </span>
        <div className="flex gap-2">
          <a
            className="text-xs text-white hover:underline"
            href="https://github.com/shahnawazAlam3641/realTalk-chatapp"
            target="_blank"
          >
            Github
          </a>
          <a
            className="text-xs text-white hover:underline"
            href="https://www.linkedin.com/in/alam-shahnawaz/"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
