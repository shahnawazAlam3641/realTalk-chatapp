import { useContext, useEffect, useRef } from "react";
import UserContext from "../context";

const ChatBox = ({
  message,
  socketRef,
  setCurrentChatBox,
  currentChatBox,
  roomCode,
}) => {
  const currentAuthor = useContext(UserContext);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
      socketRef.current?.send(JSON.stringify(message));
    }
  };

  const handleSendMessage = () => {
    if (inputRef.current.value == "") {
      return;
    }

    if (currentChatBox == "Room Chat") {
      sendMessage({
        type: "SEND_MESSAGE",
        payload: {
          author: currentAuthor,
          message: inputRef.current?.value,
          roomCode: roomCode,
        },
      });
      inputRef.current.value = "";
    }

    if (currentChatBox == "World Chat") {
      console.log("messagesent");
      sendMessage({
        type: "SEND_WORLD",
        payload: {
          author: currentAuthor,
          message: inputRef.current?.value,
        },
      });
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    const container = chatBoxRef.current;
    if (!container) return;

    console.log(container.scrollTop);
    console.log(container.scrollHeight);

    // if (container.scrollTop > container.scrollHeight - 450) {
    //   container.scrollTop = container.scrollHeight;
    // }

    const isNearBottom = (container) => {
      // Allow a small threshold (e.g., 100px) to consider the user "near" the bottom
      // const threshold = 200;
      return (
        container.scrollHeight - container.scrollTop - container.clientHeight <=
        200
      );
    };

    // Check if the user is near the bottom, then scroll to the bottom
    if (isNearBottom(container)) {
      container.scrollTop = container.scrollHeight;
    }

    console.log(message);

    // container.scrollTop = container.scrollHeight; // Scroll to the bottom
  }, [message]);

  return (
    <>
      <div
        ref={chatBoxRef}
        className="max-h-[90%] flex flex-col gap-2 overflow-y-auto px-3 scroll-smooth"
      >
        {message?.map((mess, index) => {
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
      <form
        action="submit"
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-1 h-[10%]"
      >
        <input
          ref={inputRef}
          placeholder="Type message"
          className="rounded-md px-5 w-full"
        />
        <button
          onClick={() => {
            handleSendMessage();
            // console.log(`{"type": "SEND_WORLD", "payload":{"author":"shaha","message":${inputRef.current?.value}}}`)
          }}
          className="p-2 bg-white rounded-md"
        >
          Send
        </button>
        <button
          onClick={() => setCurrentChatBox("")}
          className="p-2 bg-red-400 text-[#212121] rounded-md "
        >
          Exit
        </button>
      </form>
    </>
  );
};

export default ChatBox;
