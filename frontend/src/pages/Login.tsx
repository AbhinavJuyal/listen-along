import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket";

const Login = () => {
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const query = Object.keys(params)[0];
  const [roomId, setRoomId] = useState<string | null>(() => query || null);
  const [name, setName] = useState<string>("");

  const handleSocketConnection = (name: string, roomId: string | null) => {
    socket.auth = { name, roomId };
    socket.connect();
    socket.on("join", (name, roomId, imgId) => {
      console.log("connection established", name, roomId);
      navigate(`/room`, { replace: true, state: { name, roomId, imgId } });
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === "") {
      toast.error("You need to give a nickname");
      return;
    }
    handleSocketConnection(name, roomId);
  };

  return (
    <div className="flex justify-center text-center m-4">
      <div className="w-1/3">
        <p className="text-2xl text-left mb-4">Login</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            className="block h-10 w-full mb-8 pl-4"
            name="username"
            placeholder="Enter a nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="h-10 w-full text-sm rounded-lg bg-gray-300"
          >
            {!roomId ? "Enter Room" : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
