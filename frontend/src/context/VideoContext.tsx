import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BaseReactPlayerProps } from "react-player/base";
import {
  IPlayListInfo,
  IVideoContext,
  IVideoEvents,
  IVideoEventsFn,
  IPlayList,
} from "../../@types/video";

const VideoContext = React.createContext<IVideoContext | null>(null);
const initialVideoState: BaseReactPlayerProps = {
  url: "https://www.youtube.com/watch?v=rqtEGrSGFvw",
  pip: false,
  playing: false,
  controls: true,
  light: false,
  volume: 0.8,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  playbackRate: 1.0,
  loop: false,
};

const videoEvents = ({
  video,
  setVideo,
  playList,
  setPlayList,
  setVideoReady,
}: IVideoEventsFn): IVideoEvents => {
  const onPlay = () => {
    console.log("handlePlay");
    setVideo({ ...video, playing: true });
    // videoEventEmit("play");
  };

  const onPause = () => {
    console.log("handlePause");
    setVideo({ ...video, playing: false });
    // videoEventEmit("pause");
  };

  const onReady = () => {
    console.log("readyy");
    setVideoReady(true);
  };

  const onEnded = () => {
    console.log("end of the playlist");
  };

  const onDuration = (duration: any) => {
    console.log("duration");
    setVideo((prev) => ({ ...prev, duration }));
  };

  const onStart = () => {
    console.log("start");
  };
  const onError = (e: any) => {
    console.log("Error:", e);
  };
  const onSeek = (sec: number) => {
    console.log("seconds", sec);
  };

  return {
    onStart,
    onPlay,
    onPause,
    onEnded,
    onError,
    onDuration,
    onSeek,
    onReady,
    // onProgress,
  };
};

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

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [video, setVideo] = useState<BaseReactPlayerProps>(initialVideoState);
  const [playList, setPlayList] = useState<IPlayList>([
    "rqtEGrSGFvw",
    "coV6Vc5POhM",
    "v4WsQsRgbls",
    "-wpTY3LM5bc",
  ]);
  const [playListItemInfo, setPlayListItemInfo] = useState<IPlayListInfo[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const reactPlayerRef = useRef<any>(null);
  const [videoReady, setVideoReady] = useState<boolean>(false);

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

  let events: IVideoEvents = videoEvents({
    video,
    setVideo,
    playList,
    setPlayList,
    setVideoReady,
  });

  const value: IVideoContext = {
    video,
    playList,
    videoReady,
    setVideo,
    setPlayList,
    setVideoReady,
    events,
    reactPlayerRef,
    playListItemInfo,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

const useVideo = () => {
  return useContext(VideoContext);
};

export default useVideo;
