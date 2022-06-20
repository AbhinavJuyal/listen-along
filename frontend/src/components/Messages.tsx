import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import Message from "./Message";

interface Props {
  name: string;
  roomId: string;
}

const Messages = ({ name, roomId }: Props) => {
  const [messages, setMessages] = useState<{ name: string; message: string }[]>(
    []
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on("message", (name, data) => {
      setMessages((prev) => [...prev, { name, message: data }]);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prev) => [...prev, { name, message }]);
    socket.emit("message", name, message);
  };

  return (
    <div className="Messages">
      <div className="chat">
        {/* <Message message={message} name={name} /> */}
        <form onSubmit={handleSubmit}>
          <input type="text" />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
