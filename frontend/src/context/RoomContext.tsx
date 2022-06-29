import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  IPlayListInfo,
  IPlayList,
  IEventsFn,
  IRoomContext,
} from "../../@types/video";
import Loading from "../components/Loading";
import Room from "../pages/Room";

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

const contextEvents = ({
  currentIdx,
  setCurrentIdx,
  setUrl,
  playList,
}: IEventsFn) => {
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

  return {
    changeVideo,
    onEnded,
  };
};

const RoomContext = React.createContext<IRoomContext | any>({});

// { children }: { children: React.ReactNode }

export const RoomProvider = () => {
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

  let fns = contextEvents({ currentIdx, setCurrentIdx, setUrl, playList });

  const value = {
    ...fns,
    playList,
    setPlayList,
    currentIdx,
    setCurrentIdx,
    url,
    setUrl,
    playListItemInfo,
  };

  return (
    <RoomContext.Provider value={value}>
      <Room />
    </RoomContext.Provider>
  );
};

const useRoom = () => {
  return useContext(RoomContext);
};

export default useRoom;
