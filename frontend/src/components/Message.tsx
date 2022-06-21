interface Props {
  name: string;
  message: string;
}

const Message = ({ name, message }: Props) => {
  return (
    <div
      className={"message-bubble" + " " + (name === "server" && "text-center")}
    >
      <div className="type">{name}</div>
      <div className="message w-full bg-gray-400 rounded-xl p-4">{message}</div>
    </div>
  );
};

export default Message;
