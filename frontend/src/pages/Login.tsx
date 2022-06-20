import { useState, useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { socket } from "../utils/socket";

const localStorage: Storage = window.localStorage;

const Login = () => {
  const navigate = useNavigate();
  // const [query, setQuery] = useSearchParams();
  // console.log(query.get("id"));
  // work around to get query params T-T
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const query = Object.keys(params)[0];
  const [roomId, setRoomId] = useState<string | null>(() => query || null);
  const [name, setName] = useState<string>("");

  const handleSocketConnection = (name: string, roomId: string | null) => {
    socket.auth = { name, roomId };
    socket.connect();
    socket.on("join", (name, roomId) => {
      // localStorage.setItem("name", name);
      // localStorage.setItem("roomId", roomId);
      console.log("connection established", name, roomId);
      navigate(`/room`, { replace: true, state: { name, roomId } });
    });
    // socket.off("join");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
