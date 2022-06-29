import { SetStateAction } from "react";
import { IPlayList, IPlayListInfo } from "../../@types/video";
import PlayListItem from "../components/PlayListItem";

// rqtEGrSGFvw
// coV6Vc5POhM
// v4WsQsRgbls
// -wpTY3LM5bc

let counter = 0;
interface IProps {
  playListItemInfo: IPlayListInfo[];
  currentIdx: number;
  changeVideo: (idx: number, id: string) => void;
}

const PlayList = ({ playListItemInfo, currentIdx, changeVideo }: IProps) => {
  return (
    <div className="mx-6 my-6">
      {!(playListItemInfo?.length === 0)
        ? playListItemInfo.map((e: IPlayListInfo, idx: number) => (
            <PlayListItem
              key={e.id}
              item={e}
              active={idx === currentIdx}
              changeVideo={changeVideo}
              idx={idx}
            />
          ))
        : "playList is empty"}
    </div>
  );
};

export default PlayList;
