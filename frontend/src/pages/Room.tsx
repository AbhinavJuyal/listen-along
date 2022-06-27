import { useLocation } from "react-router-dom";
import { useState } from "react";
import Messages from "../components/Messages";
import VideoContainer from "../containers/VideoContainer";

interface sessionState {
  name: string;
  roomId: string;
  imgId: number;
}
const localStorage: Storage = window.localStorage;

const Room = () => {
  const location = useLocation();
  const state = location.state as sessionState;
  // const [details, setDetails] = useState<sessionState>(state);
  const [btnText, setBtnText] = useState<string>("Invite Link");
  const baseURL = "http://localhost:3000";
  const inviteLink = `${baseURL}?${state.roomId}`;

  return (
    <div className="w-full h-screen p-10 flex flex-col items-stretch">
      <div>
        <a
          className="block"
          href={`${baseURL}?${state.roomId}`}
          target="_blank"
        >
          {`${baseURL}?${state.roomId}`}
        </a>
        <button
          type="submit"
          className="p-3 rounded-lg bg-gray-900 text-white text-sm"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            navigator.clipboard.writeText(inviteLink);
            setBtnText("Copied!");
            setTimeout(() => {
              setBtnText("Invite Link");
            }, 1000);
          }}
        >
          {btnText}
        </button>
      </div>
      <div className="grow flex">
        <div className="grow basis-2/3 shrink-0">
          <VideoContainer />
        </div>
        <Messages name={state.name} roomId={state.roomId} imgId={state.imgId} />
      </div>
    </div>
  );
};

export default Room;
