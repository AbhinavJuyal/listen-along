import { MdSend } from "react-icons/md";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
}

const MessageInput = ({ handleSubmit, message, setMessage, error }: Props) => {
  return (
    <form className="m-2" onSubmit={handleSubmit}>
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
