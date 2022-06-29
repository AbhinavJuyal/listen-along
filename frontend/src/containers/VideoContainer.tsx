import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IPlayListInfo, IPlayList } from "../../@types/video";
import VideoPlayer from "../components/VideoPlayer";
import PlayList from "./PlayList";
import AddToPlayList from "../components/AddToPlayList";

const extractPlayListInfo = (
  res: AxiosResponse,
  setPlayListItemInfo: React.Dispatch<React.SetStateAction<IPlayListInfo[]>>
) => {
  const extract = res.data.items.map((e: any) => {
    return {
      id: e.id,
      title: e.snippet.title,
      imgURL: e.snippet.thumbnails.standard.url,
    };
  });
  setPlayListItemInfo(extract);
  console.log(extract);
};

const VideoContainer = () => {
  const [playList, setPlayList] = useState<IPlayList>([
    "rqtEGrSGFvw",
    "coV6Vc5POhM",
    "v4WsQsRgbls",
    "-wpTY3LM5bc",
  ]);
  const [playListItemInfo, setPlayListItemInfo] = useState<IPlayListInfo[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [url, setUrl] = useState<string>(
    "https://www.youtube.com/watch?v=rqtEGrSGFvw"
  );

  useEffect(() => {
    // retrieving all playlist info
    if (playList.length === 0) return;
    console.log("inside context useEffect");
    const ytURL: string = import.meta.env.VITE_YT_API_URL;
    const ytAPIKey: string = import.meta.env.VITE_YT_API_KEY;
    const videoIds: string = playList.join(",");
    const url: string = `${ytURL}?id=${videoIds}&key=${ytAPIKey}&part=snippet`;
    axios
      .get(url)
      .then((response: AxiosResponse) => {
        console.log(response);
        extractPlayListInfo(response, setPlayListItemInfo);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) console.log("Axios error", error);
      });
  }, [playList]);

  const changeVideo = (idx: number, id: string) => {
    console.log("changing video from playlist");
    const ytURL = import.meta.env.VITE_YT_URL;
    const newURL = `${ytURL}${id}`;
    setCurrentIdx(idx);
    console.log("here!");
    setUrl(newURL);
  };

  const onEnded = () => {
    console.log("end of the video");
    // playList changing etc. etc.
    const nextIdx = currentIdx + 1;
    const ytURL = import.meta.env.VITE_YT_URL;
    if (nextIdx > playList.length - 1) {
      console.log("end of the playlist");
      return;
    }
    const nextURL = `${ytURL}${playList[nextIdx]}`;
    setUrl(nextURL);
    setCurrentIdx(nextIdx);
  };

  const videoPlayerProps = {
    playList,
    currentIdx,
    setCurrentIdx,
    url,
    onEnded,
  };

  const playListProps = {
    playListItemInfo,
    currentIdx,
    changeVideo,
  };

  return (
    <>
      <VideoPlayer {...videoPlayerProps} />
      <PlayList {...playListProps} />
      <AddToPlayList />
    </>
  );
};

export default VideoContainer;
