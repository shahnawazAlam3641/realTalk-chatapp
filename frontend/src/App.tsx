import { createContext, useRef, useState } from "react";
import Home from "./components/Home";
import "./App.css";
import WorldChat from "./components/WorldChat";
import JoinWorldModal from "./components/JoinWorldModal";
import UserContext from "./context";
import RoomChat from "./components/RoomChat";

function App() {
  // const [isWorldChat, setIsWorldChat] = useState(false);
  // const [isRoomChat, setIsRoomChat] = useState(false);
  const [currentChatBox, setCurrentChatBox] = useState("");
  const [isWorldModal, setIsWorldModal] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState();

  const authorInputRef = useRef(null);

  return (
    <UserContext.Provider value={currentAuthor}>
      <div className="relative min-h-screen min-w-[100vw] bg-[#212121] flex justify-center items-center">
        {isWorldModal && (
          <JoinWorldModal
            setIsWorldModal={setIsWorldModal}
            setIsWorldChat={setIsWorldChat}
            authorInputRef={authorInputRef}
            setCurrentAuthor={setCurrentAuthor}
          />
        )}

        {/* home */}

        {currentChatBox == "" && (
          <Home
            setCurrentAuthor={setCurrentAuthor}
            setCurrentChatBox={setCurrentChatBox}
            setIsWorldModal={setIsWorldModal}
            // setIsWorldChat={setIsWorldChat}
          />
        )}

        {/* world Chat */}

        {currentChatBox == "World Chat" && (
          <WorldChat setCurrentChatBox={setCurrentChatBox} />
        )}

        {currentChatBox == "Room Chat" && (
          <RoomChat
            currentChatBox={currentChatBox}
            setCurrentChatBox={setCurrentChatBox}
          />
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
