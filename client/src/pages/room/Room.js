import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
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
  let inviteLink = `http://localhost:3000/?room=${searchParams.get("room")}`;
  let getUserDetails = useCallback(
    () => ({
      roomID: searchParams.get("room"),
      username: searchParams.get("name"),
    }),
    [searchParams]
  );

  // useEffect(() => setCount((prev) => prev + 1));
  useEffect(() => {
    socket.auth = getUserDetails();
    socket.connect();
  }, [getUserDetails]);

  useEffect(() => {
    // when client connects to the server
    socket.on("connect", () => {
      let engine = socket.io.engine;
      console.log(engine.transport.name); // in most cases, prints "polling"
      engine.once("upgrade", () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log(engine.transport.name); // in most cases, prints "websocket"
      });
    });
    // client-server
    socket.emit("hello!");
    socket.on("welcome", (msg) => {
      console.log(msg);
    });
    // for errors
    socket.on("error", (err) => alert(err.message));

    // host specific message
    socket.on("host", (msg) => console.log(msg));

    return () => {
      socket.off("welcome");
      socket.off("connect");
      socket.off("error");
    };
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
        <VideoContainer room={getUserDetails().roomID} />
        <ChatContainer
          room={getUserDetails().roomID}
          username={getUserDetails().username}
        />
      </div>
    </div>
  );
};

export default Room;
