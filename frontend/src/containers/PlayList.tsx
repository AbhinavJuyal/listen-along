import { IVideoContext } from "../../@types/video";
import PlayListItem from "../components/PlayListItem";
import useVideo from "../context/VideoContext";

let counter = 0;

const PlayList = () => {
  const { playListItemInfo, videoReady } = useVideo() as IVideoContext;
  console.log(counter++);
  console.log(playListItemInfo);
  return (
    <div>
      {!(playListItemInfo?.length === 0)
        ? playListItemInfo.map((e: any, idx: number) => (
            <PlayListItem key={e.id}></PlayListItem>
          ))
        : "playList is empty"}
    </div>
  );
};

export default PlayList;
