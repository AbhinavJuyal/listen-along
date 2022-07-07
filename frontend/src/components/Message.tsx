import { IMessage } from "../../@types/video";

interface Props {
  name: string;
  message: string;
  imgId: number;
}

const Message = ({ name, message, imgId }: IMessage) => {
  const pf = `${
    import.meta.env.VITE_SERVER_URL
  }/public/characters/${imgId}.png`;
  return (
    <div
      className={
        name === "server"
          ? "text-center"
          : "flex mt-6 items-center h-min-content"
      }
    >
      <img className="w-12 h-12 rounded-full mr-4" src={pf} alt={name} />
      <div className="">
        <div className="font-bold ml-2 mb-2 text-xs text-gray-primary">
          {name}
        </div>
        <div className="w-fit p-2 bg-white rounded-xl text-base">{message}</div>
      </div>
    </div>
  );
};

export default Message;
