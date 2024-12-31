import { useRef } from "react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_WS_SERVER;

interface HomeProps {
  setRoomCode: (val: string) => void;
  setCurrentAuthor: (val: string) => void;
  setCurrentChatBox: (val: string) => void;
  currentTab: string;
  setCurrentTab: (val: string) => void;
}

const Home = ({
  setRoomCode,
  setCurrentAuthor,
  setCurrentChatBox,
  currentTab,
  setCurrentTab,
}: HomeProps) => {
  const authorInputRef = useRef<HTMLInputElement | null>(null);

  const roomCodeInputRef = useRef<HTMLInputElement | null>(null);

  const handleTabSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLElement;
    setCurrentTab(target.innerText);
  };

  const handleJoin = () => {
    if (authorInputRef.current?.value == "") {
      toast.error("Please enter your username");
      return;
    }

    if (!authorInputRef.current?.value) {
      toast.error("Please enter your username");
      return;
    }

    const toastId = toast.loading("Please wait.");
    try {
      setCurrentAuthor(authorInputRef.current?.value);

      const wss = new WebSocket(BASE_URL);

      toast.dismiss(toastId);

      if (currentTab == "Join Room") {
        if (!roomCodeInputRef.current?.value) {
          toast.error("Please enter room code");
          return;
        }
        setRoomCode(roomCodeInputRef.current?.value);
        wss.onopen = () => {
          wss.send(
            JSON.stringify({
              type: "USERNAME_VALIDATION_ROOM",
              payload: {
                author: authorInputRef.current?.value,
                roomCode: roomCodeInputRef.current?.value,
              },
            })
          );
        };

        wss.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type == "ROOM_JOINED") {
            setCurrentChatBox("Room Chat");
          }

          if (data.type == "ERROR") {
            toast.error(data.message);
          }

          if (data.type == "USERNAME_VALIDATION_ROOM") {
            if (data.payload.isUsernameTaken) {
              toast.error("Username already exist");
            } else {
              // setCurrentChatBox("Room Chat");
              wss.send(
                JSON.stringify({
                  type: "JOIN_ROOM",
                  payload: {
                    roomCode: roomCodeInputRef.current?.value,
                    author: authorInputRef.current?.value,
                  },
                })
              );
              return;
            }
          }
        };
      }

      if (currentTab == "Create Room") {
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

          if (data.type == "ROOM_JOINED") {
            setCurrentChatBox("Room Chat");
          }

          if (data.type == "ROOM_CREATED") {
            if (!authorInputRef.current?.value) {
              toast.error("Please provide username");
              return;
            }
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
          }
        };
      }

      if (currentTab == "Join World Chat") {
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
              if (!authorInputRef.current?.value) {
                toast.error("Please enter username");
                return;
              }
              setCurrentAuthor(authorInputRef.current?.value);
              setCurrentChatBox("World Chat");
            } else {
              toast.error("Username already exists");
            }
          }
        };
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative flex flex-col gap-5 p-6 border-white border rounded-lg w-[450px] max-w-[90vw]">
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
            ref={roomCodeInputRef}
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
          onClick={handleJoin}
          className="bg-white text-[#212121] p-2 rounded-md"
        >
          {currentTab}
        </button>
      </form>
    </div>
  );
};

export default Home;
