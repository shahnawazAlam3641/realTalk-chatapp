import React from "react";
import toast from "react-hot-toast";

const JoinWorldModal = ({
  setCurrentAuthor,
  authorInputRef,
  setIsWorldChat,
  setIsWorldModal,
}) => {
  return (
    <>
      <div className="z-20 bg-black  absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  flex gap-4 border border-white p-10 rounded-md">
        <form
          action="submit"
          onSubmit={(e) => e.preventDefault()}
          className="flex gap-4 "
        >
          <input
            ref={authorInputRef}
            placeholder="Enter unique username"
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
        </form>
        <p
          onClick={() => setIsWorldModal(false)}
          className="absolute top-0 text-white right-2 cursor-pointer text-lg"
        >
          X
        </p>
      </div>
      <div
        onClick={() => setIsWorldModal(false)}
        className="absolute top-0 left-0 right-0 bottom-0 bg-[#000000ea] z-10"
      ></div>
    </>
  );
};

export default JoinWorldModal;
