import { useRef, useState } from "react";
import toast from "react-hot-toast";

const Home = ({ setCurrentAuthor, setCurrentChatBox }) => {
  // const [worldModal, setWorldModal] = useState(false);
  const authorInputRef = useRef(null);

  const [currentTab, setCurrentTab] = useState("Join World Chat");

  const handleTabSwitch = (e) => {
    setCurrentTab(e.target.innerText);
  };

  const handleJoinWorld = () => {
    if (authorInputRef.current?.value == "") {
      toast.error("Please enter your username");
      return;
    }

    const wss = new WebSocket("ws://localhost:8080");

    if (currentTab == "Create Room") {
      // const wss = new WebSocket("ws://localhost:8080");

      wss.onopen = () => {
        wss.send(
          JSON.stringify({
            type: "CREATE_ROOM",
            payload: {
              author: authorInputRef.current?.value,
            },
          })
        );
      };

      wss.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type == "ROOM_JOINED") {
          setCurrentChatBox("Room Chat");
        }

        if (data.type == "ROOM_CREATED") {
          // if (!data.payload.isUsernameTaken) {
          setCurrentAuthor(authorInputRef.current?.value);

          wss.send(
            JSON.stringify({
              type: "JOIN_ROOM",
              payload: {
                roomCode: data.roomCode,
                author: authorInputRef.current?.value,
              },
            })
          );
          // setCurrentChatBox("Room Chat");
          // setIsWorldChat(true);
          // } else {
          //   toast.error("Username already exists");
          // }
        }
      };
    }

    if (currentTab == "Join World Chat") {
      // const wss = new WebSocket("ws://localhost:8080");

      wss.onopen = () => {
        wss.send(
          JSON.stringify({
            type: "USERNAME_VALIDATION_WORLD",
            payload: {
              username: authorInputRef.current?.value,
            },
          })
        );
      };

      wss.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type == "USERNAME_VALIDATION_WORLD") {
          if (!data.payload.isUsernameTaken) {
            setCurrentAuthor(authorInputRef.current?.value);
            setCurrentChatBox("World Chat");
            // setIsWorldChat(true);
          } else {
            toast.error("Username already exists");
          }
        }
      };
    }
  };

  return (
    <div className="relative flex flex-col gap-5 p-6 border-white border rounded-lg w-[450px] max-w-[90vw]">
      {/* <form
        onSubmit={(e) => e.preventDefault()}
        action="submit"
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Enter Unique Username"
          className="p-2 rounded-md text-center"
        />
        <button className="bg-white text-[#212121] p-2 rounded-md">
          Create Room
        </button>
      </form> */}
      <div className="flex justify-between">
        <button
          onClick={handleTabSwitch}
          className={`p-2  rounded-md font-medium  ${
            currentTab == "Join World Chat"
              ? "bg-[#313131] text-white"
              : "bg-white text-[#212121]"
          }`}
        >
          Join World Chat
        </button>
        <button
          onClick={handleTabSwitch}
          className={`p-2  rounded-md font-medium  ${
            currentTab == "Join Room"
              ? "bg-[#313131] text-white"
              : "bg-white text-[#212121]"
          }`}
        >
          Join Room
        </button>
        <button
          onClick={handleTabSwitch}
          className={`p-2  rounded-md font-medium  ${
            currentTab == "Create Room"
              ? "bg-[#313131] text-white"
              : "bg-white text-[#212121]"
          }`}
        >
          Create Room
        </button>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        action="submit"
        className="flex flex-col gap-2"
      >
        {currentTab == "Join Room" && (
          <input
            type="text"
            placeholder="Enter Room Code"
            className="p-2 rounded-md text-center"
          />
        )}
        <input
          ref={authorInputRef}
          type="text"
          placeholder="Enter Unique Username"
          className="p-2 rounded-md text-center"
        />
        <button
          onClick={handleJoinWorld}
          className="bg-white text-[#212121] p-2 rounded-md"
        >
          {currentTab}
        </button>
      </form>
      {/* <form
        onSubmit={(e) => e.preventDefault()}
        action="submit"
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Enter Unique Username"
          className="p-2 rounded-md text-center"
        />
        <button className="bg-white text-[#212121] p-2 rounded-md">
          Join World Chat
        </button>
      </form> */}
    </div>
  );
};

export default Home;
