import { IPlayListInfo } from "../../@types/video";
import { MdOutlineMoreVert, MdPlayArrow } from "react-icons/md";

interface IProps {
  item: IPlayListInfo;
  active: boolean;
  changeVideo: (idx: number, id: string) => void;
  idx: number;
}

const PlayListItem = ({ item, active, changeVideo, idx }: IProps) => {
  return (
    <div
      className={
        "px-4 py-[18px] cursor-pointer mb-4 group " + (active && "bg-slate-400")
      }
    >
      <div className="flex items-center w-full h-8">
        <button
          className="w-5 h-5 mr-4 invisible group-hover:visible"
          onClick={() => changeVideo(idx, item.id)}
        >
          <MdPlayArrow className="w-full h-full" />
        </button>
        <img
          crossOrigin="anonymous"
          src={`${item.imgURL}?a-dummy-parameter`}
          className="w-8 h-8"
          alt="Video Cover"
          data-id={idx}
        />
        <div className="ml-12">{item.title}</div>
        <button className="ml-auto w-5 h-5">
          <MdOutlineMoreVert className="w-full h-full" />
        </button>
      </div>
    </div>
  );
};

export default PlayListItem;
