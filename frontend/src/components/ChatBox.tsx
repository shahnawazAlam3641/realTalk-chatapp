import { useContext, useEffect, useRef } from "react";
import UserContext from "../context";

const ChatBox = ({ message }) => {
  const currentAuthor = useContext(UserContext);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const container = chatBoxRef.current;
    if (!container) return;

    console.log(container.scrollTop);
    console.log(container.scrollHeight);

    if (container.scrollTop > container.scrollHeight - 450) {
      container.scrollTop = container.scrollHeight;
    }

    // container.scrollTop = container.scrollHeight; // Scroll to the bottom
  }, [message]);

  return (
    <div
      ref={chatBoxRef}
      className="max-h-[90%] flex flex-col gap-2 overflow-y-auto px-3 scroll-smooth"
    >
      {message.map((mess, index) => {
        return (
          <p
            key={index}
            className={`p-1  rounded-sm w-fit max-w-[80%] flex flex-col ${
              mess.author == currentAuthor
                ? "ml-auto bg-[#515151] text-white"
                : "bg-white"
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
  );
};

export default ChatBox;
