import { useContext, useEffect, useRef } from "react";
import UserContext from "../context";
import toast from "react-hot-toast";

interface Message {
  type: string;
  payload: Payload;
}
interface Payload {
  author: string;
  message: string;
  roomCode?: string;
}
interface ChatBoxProps {
  message: Payload[];
  socketRef: React.MutableRefObject<WebSocket | null>;
  setCurrentChatBox: (val: string) => void;
  currentChatBox: string;
  roomCode?: string;
}

const ChatBox = ({
  message,
  socketRef,
  setCurrentChatBox,
  currentChatBox,
  roomCode,
}: ChatBoxProps) => {
  const currentAuthor = useContext(UserContext);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = (message: Message) => {
    console.log(message);
    if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      toast.error("Error occured while sending message");
    }
  };

  const handleSendMessage = () => {
    if (chatInputRef.current?.value == "") {
      toast.error("Enter your messsage");
      return;
    }

    if (currentChatBox == "Room Chat") {
      if (chatInputRef.current?.value) {
        sendMessage({
          type: "SEND_MESSAGE",
          payload: {
            author: currentAuthor,
            message: chatInputRef.current?.value,
            roomCode: roomCode,
          },
        });
      }

      if (chatInputRef.current?.value) {
        chatInputRef.current.value = "";
      }
    }
    if (currentChatBox == "World Chat") {
      console.log("messagesent");
      if (chatInputRef.current?.value) {
        sendMessage({
          type: "SEND_WORLD",
          payload: {
            author: currentAuthor,
            message: chatInputRef.current?.value,
          },
        });
      }
      if (chatInputRef.current?.value) {
        chatInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    const container = chatBoxRef.current;
    if (!container) return;

    console.log(container.scrollTop);
    console.log(container.scrollHeight);

    const isNearBottom = (container: HTMLDivElement) => {
      return (
        container.scrollHeight - container.scrollTop - container.clientHeight <=
        200
      );
    };

    if (isNearBottom(container)) {
      container.scrollTop = container.scrollHeight;
    }

    console.log(message);
  }, [message]);

  return (
    <div className="max-h-[90%] flex flex-col  gap-2 overflow-y-auto px-3 scroll-smooth">
      <div
        ref={chatBoxRef}
        className="max-h-[90%] flex flex-col  gap-2 overflow-y-auto px-3 scroll-smooth"
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
          ref={chatInputRef}
          placeholder="Type message"
          className="rounded-md px-5 w-full"
        />
        <button
          onClick={() => {
            handleSendMessage();
            // console.log(`{"type": "SEND_WORLD", "payload":{"author":"shaha","message":${chatInputRef.current?.value}}}`)
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
    </div>
  );
};

export default ChatBox;
