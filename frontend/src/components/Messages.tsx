import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import Message from "./Message";
import MessageInput from "./MessageInput";

interface Props {
  name: string;
  roomId: string;
}

interface Message {
  name: string;
  message: string;
}

const Messages = ({ name, roomId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on("message", (name, message) => {
      setMessages((prev) => [...prev, { name, message }]);
      console.log({ name, message });
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prev) => [...prev, { name, message }]);
    socket.emit("message", name, message);
    setMessage("");
  };

  return (
    <div className="Messages">
      <div className="chat w-full">
        <h4 className="title ml-2">Chat</h4>
        {/* <Message message={message} name={name} /> */}
        <div className="messageArr p-4">
          {messages.length === 0 ? (
            <div>Messages will be here!</div>
          ) : (
            messages.map((e, idx) => {
              return <Message name={e.name} message={e.message} />;
            })
          )}
        </div>
        <MessageInput
          handleSubmit={handleSubmit}
          message={message}
          setMessage={setMessage}
        />
      </div>
    </div>
  );
};

export default Messages;
