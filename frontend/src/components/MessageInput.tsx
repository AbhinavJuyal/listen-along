import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import useDebounce from "../utils/useDebounce";
import BotMesssage from "./BotMesssage";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
}

const MessageInput = ({ handleSubmit, message, setMessage, error }: Props) => {
  const debouncedValue = useDebounce<string>(message, 300);
  const [showCmd, setShowCmd] = useState<boolean>(false);

  useEffect(() => {
    console.log("here", debouncedValue);
    let str = debouncedValue.split(" ");
    if (str[0] === "yt+") {
      setShowCmd(true);
      return;
    }
    setShowCmd(false);
  }, [debouncedValue]);

  return (
    <form className="m-2 relative" onSubmit={handleSubmit}>
      <BotMesssage show={showCmd} />
      {error && (
        <div className="text-xs py-2 px-2 pl-4 text-red-400">
          Message Cannot be empty
        </div>
      )}
      <div className="flex w-full rounded-full px-2 py-1 bg-gray-200">
        <input
          type="text"
          className="h-12 w-full pl-4 mr-4 bg-transparent border-none outline-none"
          value={message}
          placeholder="Type something here..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="p-2">
          <MdSend />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
