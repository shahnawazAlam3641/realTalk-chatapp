import React from "react";

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
          setCurrentAuthor(authorInputRef.current?.value);
          setIsWorldChat(true);
          setIsWorldModal(false);
        }}
        className="bg-white text-[#212121] p-2 rounded-md"
      >
        Join
      </button>
    </div>
  );
};

export default JoinWorldModal;
