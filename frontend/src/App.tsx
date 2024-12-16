import { useState } from "react";
import Home from "./components/Home";
import "./App.css";
import WorldChat from "./components/WorldChat";

function App() {
  const [isWorldChat, setIsWorldChat] = useState(false);

  return (
    <div className="min-h-screen min-w-[100vw] bg-[#212121] flex justify-center items-center">
      {!isWorldChat && <Home setIsWorldChat={setIsWorldChat} />}
      {isWorldChat && <WorldChat setIsWorldChat={setIsWorldChat} />}
    </div>
  );
}

export default App;
