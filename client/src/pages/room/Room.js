import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
// import AudioContainer from "../../components/AudioContainer/AudioContainer";
import VideoContainer from "../../components/VideoContainer/VideoContainer";
import { socket } from "../../services/socket";
import "./Room.css";

// messages schema
// const messages = [
//   {
//     username: "",
//     msg: "",
//   },
//   {
//     username: "",
//     msg: "",
//   },
//   {
//     username: "admin",
//     msg: "",
//   },
// ];

const Room = () => {
  let [searchParams] = useSearchParams();
  let userDetails = {
    roomID: searchParams.get("room"),
    username: searchParams.get("name"),
  };
  let inviteLink = `http://localhost:3000/?room=${searchParams.get("room")}`;
  useEffect(() => {
    socket.connect();
    socket.emit("join", userDetails);
    socket.on("connect", () => {
      const engine = socket.io.engine;
      console.log(engine.transport.name); // in most cases, prints "polling"
      engine.once("upgrade", () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log(engine.transport.name); // in most cases, prints "websocket"
      });
    });
    socket.emit("hello!");
    socket.on("Welcome", (msg) => {
      console.log(msg);
    });
  }, []);
  return (
    <div>
      <p>
        invite link : &nbsp;
        <a href={inviteLink} target="_blank" rel="noreferrer">
          {inviteLink}
        </a>
      </p>
      <div className="container-wrapper">
        <VideoContainer room={searchParams.get("room")} />
        <ChatContainer
          room={userDetails.roomID}
          username={userDetails.username}
        />
      </div>
    </div>
  );
};

export default Room;
