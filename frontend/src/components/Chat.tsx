import React, { useEffect, useRef, useState } from "react";
import { MdChat } from "react-icons/md";
import { IMessage } from "../../@types/video";
import { socket } from "../utils/socket";
import Message from "./Message";
import MessageInput from "./MessageInput";

interface Props {
  name: string;
  roomId: string;
  imgId: number;
}

const Chat = ({ name, roomId, imgId }: Props) => {
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
    const sendMessage: IMessage = {
      name: "",
      message: "",
      imgId: -1,
    };
    if (message === "") {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
      return;
    }
    if (message.startsWith(cmd) && message.split(" ")[0] === cmd) {
      // calling bot and other things
      // sendMessage.name = "bot";
      // sendMessage.messsage = "Adding video to the playlist ❤️";
      // sendMessage.imgId = 0;
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     ...sendMessage,
      //   },
      // ]);
      console.log("bot message:");
      return;
    }
    setMessages((prev) => [...prev, { ...sendMessage }]);
    socket.emit(
      "message",
      sendMessage.name,
      sendMessage.message,
      sendMessage.imgId
    );
    setMessage("");
    return;
  };

  const handleScroll = (e: React.HTMLAttributes<HTMLDivElement>) => {
    const chat: HTMLDivElement | null = chatContainer.current;
    if (chat?.scrollTop === 0) {
    }
  };

  return (
    <div className="w-full basis-1/3 flex flex-col justify-between items-stretch">
      <h4 className="ml-2 text-2xl font-bold">Chat</h4>
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
