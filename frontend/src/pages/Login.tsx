import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../utils/socket";

const localStorage: Storage = window.localStorage;

const Login = () => {
  const [name, setName] = useState("");
  // if roomId was already present in the url
  // let { roomId } = useParams();
  // roomId = roomId || (localStorage.getItem("roomId") as string);

  const navigate = useNavigate();

  const handleSocketConnection = (name: string) => {
    socket.auth = { name };
    socket.connect();
    socket.on("join", (name, roomId) => {
      localStorage.setItem("name", name);
      localStorage.setItem("roomId", roomId);
      console.log("connection established", name, roomId);
      navigate(`/room/${roomId}`, { replace: true, state: { name, roomId } });
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleSocketConnection(name);
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
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button
            type="submit"
            className="h-10 w-full text-sm rounded-lg bg-gray-300"
          >
            Enter Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
