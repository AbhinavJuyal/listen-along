interface Props {
  name: string;
  message: string;
  imgId: number;
}

const Message = ({ name, message, imgId }: Props) => {
  const pf = `${
    import.meta.env.VITE_SERVER_URL
  }/public/characters/${imgId}.png`;
  console.log(pf);
  return (
    <div className={name === "server" ? "text-center" : "flex mt-4"}>
      <img className="w-12 h-12 rounded-full mr-4" src={pf} alt={name} />
      <div className="">
        {/* <div className="font-bold ml-4 text-sm">{name}</div> */}
        <div className="w-full bg-gray-200 rounded-xl p-4 text-sm">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Message;
