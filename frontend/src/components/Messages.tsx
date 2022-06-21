import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import Message from "./Message";
import MessageInput from "./MessageInput";

interface Props {
  name: string;
  roomId: string;
  imgId: number;
}

interface Message {
  name: string;
  message: string;
  imgId: number;
}

const Messages = ({ name, roomId, imgId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // recieving messages
    socket.on("message", (name, message, imgId) => {
      setMessages((prev) => [...prev, { name, message, imgId }]);
      console.log({ name, message, imgId });
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // sending messages
    e.preventDefault();
    setMessages((prev) => [...prev, { name, message, imgId }]);
    socket.emit("message", name, message, imgId);
    setMessage("");
  };

  return (
    <div className="w-full basis-1/3 flex flex-col justify-between items-stretch">
      <h4 className="ml-2 text-2xl font-bold">Chat</h4>
      <div>
        <div className="p-4">
          {messages.length === 0 ? (
            <div>Messages will be here!</div>
          ) : (
            messages.map((e, idx) => {
              return (
                <Message
                  key={idx}
                  name={e.name}
                  message={e.message}
                  imgId={e.imgId}
                />
              );
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
