import React, { useEffect, useRef, useState } from "react";
import { IMessage, IRoomContext } from "../../@types/video";
import useRoom from "../context/RoomContext";
import { socket } from "../utils/socket";
import Message from "./Message";
import MessageInput from "./MessageInput";

interface Props {
  name: string;
  roomId: string;
  imgId: number;
}

const Chat = ({ name, roomId, imgId }: Props) => {
  const { botAddToPlayList } = useRoom() as IRoomContext;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const chatContainer = useRef<HTMLDivElement>(null);
  const cmd = import.meta.env.VITE_BOT_CMD;
  useEffect(() => {
    // prev messages
    socket.on("prevMessages", (messages) => {
      setMessages((prev) => [...prev, messages]);
    });

    return () => {
      socket.off("prevMessages");
    };
  }, []);

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

  // scroll to bottom
  useEffect(() => {
    const chat: HTMLDivElement | null = chatContainer.current;
    if (!chat) {
      console.log("Chat Container element not Found!");
      return;
    }
    const scrollHeight: number = chat.scrollHeight;
    chat.scrollTo(0, scrollHeight);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // sending messages
    e.preventDefault();
    if (message === null || message === undefined || message.trim() === "") {
      // setError(true);
      // setTimeout(() => {
      //   setError(false);
      // }, 2000);
      return;
    }
    // defaults
    const sendMessage: IMessage = {
      name,
      message,
      imgId,
    };
    if (message.startsWith(cmd) && message.split(" ")[0] === cmd) {
      // calling bot and other things
      // sending url to bot for parsing...
      console.log(message.split(" "));
      botAddToPlayList(message.split(" ")[1]);
      // console.log(res);
      // sendMessage.message = res.message;
      // sendMessage.imgId = 0;
      // sendMessage.name = "bot";
      // console.log("bot message:");
      setMessage("");
      return;
    }
    setMessages((prev) => [...prev, { ...sendMessage }]);
    socket.emit("message", sendMessage.name, message, sendMessage.imgId);
    setMessage("");
    return;
  };

  // const handleScroll = (e: React.HTMLAttributes<HTMLDivElement>) => {
  //   const chat: HTMLDivElement | null = chatContainer.current;
  //   if (chat?.scrollTop === 0) {
  //   }
  // };

  return (
    <div className="w-full basis-1/3 flex flex-col justify-between items-stretch bg-black-800 rounded-lg p-2 mr-6">
      <h4 className="ml-2 mt-1 text-2xl font-bold text-white">Chat</h4>
      <div className="grow shrink basis-auto flex flex-col h-96">
        <div
          ref={chatContainer}
          // onScroll={handleScroll}
          className="max-h-full p-4 overflow-y-auto mt-auto"
        >
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
          error={error}
        />
      </div>
    </div>
  );
};

export default Chat;
