import { IPlayListInfo } from "../../@types/video";
import { MdOutlineMoreVert, MdPlayArrow } from "react-icons/md";

interface IProps {
  item: IPlayListInfo;
  active: boolean;
  changeVideo: (idx: number, id: string) => void;
  idx: number;
}
// py-[18px]
const PlayListItem = ({ item, active, changeVideo, idx }: IProps) => {
  return (
    <div
      className={
        "px-4 py-2 cursor-pointer mb-4 group text-white rounded-lg " +
        (active ? "bg-gray-primary/25" : "bg-black-800")
      }
    >
      <div className="flex items-center w-full">
        <button
          className="w-5 h-5 mr-4 invisible group-hover:visible"
          onClick={() => changeVideo(idx, item.id)}
        >
          <MdPlayArrow className="" color="white" />
        </button>
        <img
          src={`${item.imgURL}`}
          className="w-16"
          alt="Video Cover"
          data-id={idx}
        />
        <div>
          <div className="ml-12 text-sm text-white font-semibold">
            {item.title}
          </div>
          <div className="ml-12 text-sm text-gray-primary font-medium">
            {item.channelTitle}
          </div>
        </div>
        <button className="ml-auto w-5 h-5">
          <MdOutlineMoreVert className="w-full h-full" color="white" />
        </button>
      </div>
    </div>
  );
};

export default PlayListItem;
