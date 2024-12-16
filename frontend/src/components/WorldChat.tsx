import { useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const WorldChat = ({ setIsWorldChat }) => {
  const inputRef = useRef(null);
  const { message, sendMessage } = useWebSocket("ws://localhost:8080");
  const [worldModal, setWorldModal] = useState(false);
  return (
    <div className="min-h-[90vh] max-h-[90vh] w-600px max-w-[90%] border border-white p-5 flex flex-col justify-end gap-2 rounded-lg">
      <div className="max-h-[90%] flex flex-col gap-2 overflow-y-auto">
        {message.map((mess, index) => {
          return (
            <p
              key={index}
              className="p-1 bg-white rounded-sm w-fit max-w-[80%] "
            >
              {mess}
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
            sendMessage({
              type: "SEND_WORLD",
              payload: {
                author: "self",
                message: inputRef.current?.value,
              },
            })
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
