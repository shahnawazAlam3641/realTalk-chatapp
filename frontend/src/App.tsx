import { createContext, useRef, useState } from "react";
import Home from "./components/Home";
import "./App.css";
import WorldChat from "./components/WorldChat";
import JoinWorldModal from "./components/JoinWorldModal";
import UserContext from "./context";

function App() {
  const [isWorldChat, setIsWorldChat] = useState(false);
  const [isWorldModal, setIsWorldModal] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState();

  const authorInputRef = useRef(null);

  return (
    <UserContext.Provider value={currentAuthor}>
      <div className="min-h-screen min-w-[100vw] bg-[#212121] flex justify-center items-center">
        {isWorldModal && (
          <JoinWorldModal
            setIsWorldModal={setIsWorldModal}
            setIsWorldChat={setIsWorldChat}
            authorInputRef={authorInputRef}
            setCurrentAuthor={setCurrentAuthor}
          />
        )}

        {/* home */}

        {!isWorldChat && (
          <Home
            setIsWorldModal={setIsWorldModal}
            setIsWorldChat={setIsWorldChat}
            isWorldModal={isWorldModal}
          />
        )}

        {/* world Chat */}

        {isWorldChat && <WorldChat setIsWorldChat={setIsWorldChat} />}
      </div>
    </UserContext.Provider>
  );
}

export default App;
