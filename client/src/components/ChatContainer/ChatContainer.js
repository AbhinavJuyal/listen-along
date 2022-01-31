import React, { useEffect, useState } from "react";
import { socket } from "../../services/socket";
import MessageBox from "../MessageBox/MessageBox";
import "./ChatContainer.css";

const ChatContainer = ({ room, username }) => {
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  const getUserDetails = () => ({ roomID: room, username: username });

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
