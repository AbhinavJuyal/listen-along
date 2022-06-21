import { MdSend } from "react-icons/md";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MessageInput = ({ handleSubmit, message, setMessage }: Props) => {
  return (
    <form className="m-2" onSubmit={handleSubmit}>
      <div className="flex w-full rounded-full px-2 py-1 my-4 bg-red-50">
        <input
          type="text"
          className="h-10 w-full pl-4 mr-4 bg-transparent border-none"
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
