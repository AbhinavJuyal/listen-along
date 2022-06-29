import BotImg from "../assets/bot.svg";

const BotMesssage = ({ show }: { show: boolean }) => {
  const cmd = import.meta.env.VITE_BOT_CMD;

  return (
    <div
      className={
        "w-full bg-white rounded-xl absolute bottom-16 left-0 shadow-xl " +
        (show ? "block" : "hidden")
      }
    >
      <div className="m-4 flex items-center">
        <img src={BotImg} className="w-14 h-14 mr-4" alt="bot-image" />
        <div className="grow">
          <p className="text-gray-500 text-sm font-bold mb-1">Bot Command</p>
          <div className="flex items-center text-lg font-bold">
            <span className="mr-2">{cmd}</span>
            <code className="bg-black text-white p-2 rounded-lg whitespace-nowrap mr-2">
              :yt-video-link
            </code>
            <span className="mr-2">or</span>
            <code className="bg-black text-white p-2 rounded-lg whitespace-nowrap mr-2">
              :query
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotMesssage;
