import { useRef, useState } from "react";

const Home = ({ setIsWorldChat, setIsWorldModal, isWorldModal }) => {
  // const [worldModal, setWorldModal] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState();
  const authorInputRef = useRef(null);

  return (
    <div className="relative flex flex-col gap-5 p-6 border-white border rounded-lg">
      <button className="bg-white text-[#212121] p-5 rounded-md">
        Create Room
      </button>
      <div className="flex gap-4">
        <input placeholder="Enter Room Code" className="px-2 rounded-md" />
        <button className="bg-white text-[#212121] p-2 rounded-md">
          Join Room
        </button>
      </div>
      <button
        onClick={() => setIsWorldModal(true)}
        className="bg-white text-[#212121] p-5 rounded-md"
      >
        Join World Chat
      </button>
      {/* {isWorldModal && (
        <div className="flex gap-4">
          <input
            ref={authorInputRef}
            placeholder="Enter unique username to join"
            className="px-2 rounded-md"
          />
          <button onClick={} className="bg-white text-[#212121] p-2 rounded-md">
            Join
          </button>
        </div>
      )} */}
    </div>
  );
};

export default Home;
