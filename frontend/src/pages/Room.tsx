import { socket } from "../utils/socket";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Messages from "../components/Messages";

interface sessionState {
  name: string;
  roomId: string;
}
const localStorage: Storage = window.localStorage;

const Room = () => {
  const location = useLocation();
  const state = location.state as sessionState;
  const [details, setDetails] = useState<{ name: string; roomId: string }>(
    state
  );
  const [btnText, setBtnText] = useState<string>("Invite Link");
  const inviteLink = `http://localhost:3000?${details.roomId}`;

  return (
    <div className="w-full h-screen p-10">
      <a
        className="block"
        href={`http://localhost:3000?${details.roomId}`}
        target="_blank"
      >
        {`http://localhost:3000?${details.roomId}`}
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
      <div className="grid grid-cols-2 mt-8">
        <div className="">Music here</div>
        <div className="">
          {<Messages name={details.name} roomId={details.roomId} />}
        </div>
      </div>
    </div>
  );
};

export default Room;
