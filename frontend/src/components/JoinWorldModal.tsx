import React from "react";
import toast from "react-hot-toast";

const JoinWorldModal = ({
  setCurrentAuthor,
  authorInputRef,
  setIsWorldChat,
  setIsWorldModal,
}) => {
  return (
    <div className="flex gap-4">
      <input
        ref={authorInputRef}
        placeholder="Enter unique username to join"
        className="px-2 rounded-md"
      />
      <button
        onClick={() => {
          const wss = new WebSocket("ws://localhost:8080");

          wss.onopen = () => {
            wss.send(
              JSON.stringify({
                type: "USERNAME_VALIDATION",
                payload: {
                  username: authorInputRef.current.value,
                },
              })
            );
          };

          wss.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type == "USERNAME_VALIDATION") {
              if (!data.payload.isUsernameTaken) {
                setCurrentAuthor(authorInputRef.current?.value);
                setIsWorldChat(true);
                setIsWorldModal(false);
              } else {
                toast.error("Username already exists");
              }
            }
          };
        }}
        className="bg-white text-[#212121] p-2 rounded-md"
      >
        Join
      </button>
    </div>
  );
};

export default JoinWorldModal;
