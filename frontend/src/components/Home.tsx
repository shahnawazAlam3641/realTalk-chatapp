const Home = ({ setIsWorldChat }) => {
  return (
    <div className="flex flex-col gap-5 p-6 border-white border rounded-lg">
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
        onClick={() => setIsWorldChat(true)}
        className="bg-white text-[#212121] p-5 rounded-md"
      >
        Join World Chat
      </button>
    </div>
  );
};

export default Home;
