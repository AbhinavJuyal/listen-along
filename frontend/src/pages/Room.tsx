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

  return (
    <div className="room">
      {"Link"}
      <br />
      <a
        href={`http://localhost:3000?${details.roomId}`}
        target="_blank"
      >{`http://localhost:3000?${details.roomId}`}</a>
      <br />
      <br />
      <br />
      {details.roomId && (
        <Messages name={details.name} roomId={details.roomId} />
      )}
    </div>
  );
};

export default Room;
