import { useLocation } from "react-router-dom";
import { useState } from "react";
import Chat from "../components/Chat";
import VideoPlayer from "../components/VideoPlayer";
import PlayList from "../containers/PlayList";

interface sessionState {
  name: string;
  roomId: string;
  imgId: number;
}

const Room = () => {
  const location = useLocation();
  const state = location.state as sessionState;
  const [btnText, setBtnText] = useState<string>("Invite Link");
  const baseURL = "http://localhost:3000";
  const inviteLink = `${baseURL}?${state.roomId}`;

  return (
    <div className="w-full h-full p-4 pt-0 flex flex-col items-stretch">
      <div className="text-right mb-4">
        {/* <a
          className="block"
          href={`${baseURL}?${state.roomId}`}
          target="_blank"
        >
          {`${baseURL}?${state.roomId}`}
        </a> */}
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
        <div className="grow basis-2/3 shrink-0 flex flex-col">
          <VideoPlayer />
          <div className="text-gray-primary text-sm mb-4 font-bold">
            Up Next
          </div>
          <PlayList />
        </div>
        <Chat name={state.name} roomId={state.roomId} imgId={state.imgId} />
      </div>
    </div>
  );
};

export default Room;
