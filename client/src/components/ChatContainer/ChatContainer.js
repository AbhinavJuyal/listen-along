import React, { useEffect, useState, useCallback } from "react";
import { socket } from "../../services/socket";
import MessageBox from "../MessageBox/MessageBox";
import "./ChatContainer.css";

const ChatContainer = ({ room, username }) => {
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  const getUserDetails = useCallback(() => {
    const userDetails = {
      roomID: room,
      username: username,
    };
    return userDetails;
  }, [room, username]);

  useEffect(() => {
    let userDetails = getUserDetails();
    socket.emit("join", userDetails);
  }, [getUserDetails]);

  useEffect(() => {
    socket.emit("hello!");
    socket.on("Welcome", (msg) => {
      console.log(msg);
    });
  }, []);

  useEffect(() => {
    socket.on("server_message", (msg) => {
      setMessages((prevState) => [...prevState, msg]);
    });
    socket.on("client_message", (msg) => {
      setMessages((prevState) => [...prevState, msg]);
    });
  }, []);

  const msgSubmit = (e) => {
    e.preventDefault();
    let userDetails = getUserDetails();
    let newMessage = {
      ...userDetails,
      msg: message,
    };
    setMessage("");
    socket.emit("client_message", newMessage);
  };

  const msgChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="chat-container">
      <ul id="messages">
        {messages.map((obj, idx) => (
          <MessageBox getUserDetails={getUserDetails} obj={obj} key={idx} />
        ))}
      </ul>
      <form id="chatForm" onSubmit={msgSubmit}>
        <input
          id="input"
          value={message}
          onChange={msgChange}
          autoComplete="off"
          required
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default ChatContainer;
