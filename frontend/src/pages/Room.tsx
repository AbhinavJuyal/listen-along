import { socket } from "../utils/socket";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Messages from "../components/Messages";

interface sessionState {
  name: string;
  roomId?: string;
}
const localStorage: Storage = window.localStorage;

const Room = () => {
  const [details, setDetails] = useState<{ name: string; roomId: string }>({
    name: "",
    roomId: "",
  });
  // getting state from login or localStorage
  const location = useLocation();
  const state = location.state as sessionState;
  let name = state?.name || (localStorage.getItem("name") as string);
  let roomId = state?.roomId || (localStorage.getItem("roomId") as string);

  useEffect(() => {
    socket.auth = { name, roomId };
    socket.connect();
    socket.on("join", (name, roomId) => {
      localStorage.setItem("roomId", roomId);
      setDetails({ name, roomId });
      console.log("connection established", name, roomId);
    });
  }, []);

  return (
    <div className="room">
      {"Link"}
      <br />
      <a
        href={`http://localhost:3000/room/${roomId}`}
        target="_blank"
      >{`http://localhost:3000/room/${roomId}`}</a>
      <br />
      <br />
      <br />
      {details.roomId && <Messages name={name} roomId={roomId} />}
    </div>
  );
};

export default Room;
