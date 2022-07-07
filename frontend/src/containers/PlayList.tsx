import { IPlayList, IPlayListInfo, IRoomContext } from "../../@types/video";
import PlayListItem from "../components/PlayListItem";
import useRoom from "../context/RoomContext";

// rqtEGrSGFvw
// coV6Vc5POhM
// v4WsQsRgbls
// -wpTY3LM5bc

let counter = 0;
interface IProps {
  playList: IPlayList;
  currentIdx: number;
  changeVideo: (idx: number, id: string) => void;
}

// mx-6 my-6
const PlayList = () => {
  const { playList, currentIdx, changeVideo } = useRoom() as IRoomContext;
  return (
    <div className="mx-6 grow">
      <div className="relative h-full">
        <div className="absolute top-0 right-0 bottom-0 left-0 overflow-y-auto overflow-x-hidden">
          {playList && !(playList.length === 0) ? (
            playList.map((e: IPlayListInfo, idx: number) => (
              <PlayListItem
                key={e.id}
                item={e}
                active={idx === currentIdx}
                changeVideo={changeVideo}
                idx={idx}
              />
            ))
          ) : (
            <div className="text-white font-bold">playList is empty</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayList;
