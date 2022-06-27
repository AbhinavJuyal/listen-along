import React, { useContext, useRef, useState } from "react";
import { BaseReactPlayerProps } from "react-player/base";
import {
  IVideoContext,
  IVideoEvents,
  IVideoEventsFn,
  PlayList,
} from "../../@types/video";

// yt links
// https://www.youtube.com/watch?v=rqtEGrSGFvw
// https://www.youtube.com/watch?v=coV6Vc5POhM
// https://www.youtube.com/watch?v=v4WsQsRgbls
// https://www.youtube.com/watch?v=-wpTY3LM5bc
// takayan: "https://www.youtube.com/watch?v=v4WsQsRgbls"

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
    // let data = syncState.current;
    // if (data) {
    //   setVideo(data.video);
    //   setPlayList(data.playList);
    //   console.log("easy professional development", data);
    //   console.log("seconds", data.video.played * data.video.duration);
    //   reactPlayerRef.current.seekTo(
    //     data.video.played * data.video.duration,
    //     "seconds"
    //   );
    //   // reactPlayerRef.current.seekTo(data.played);
    //   syncState.current = null;
    // }
    // setVideoReady(true);
    // if (video.played && video.duration)
    // reactPlayerRef.current.seekTo(video.played * video.duration, "seconds");
  };

  const onEnded = () => {
    console.log("handleOnEnded");
    let currentURLIdx = playList[0] as number;
    let nextURLIdx = currentURLIdx + 1;
    if (nextURLIdx <= playList.length - 1) {
      setVideo((prev) => ({
        ...initialVideoState,
        playing: prev.playing,
        url: playList[nextURLIdx],
      }));
      setPlayList((prev) => [nextURLIdx, ...prev.slice(1)]);
    } else {
      console.log("end of the playlist");
    }
  };

  const onDuration = (duration: any) => {
    console.log("duration");
    setVideo((prev) => ({ ...prev, duration }));
  };

  const onProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }): void => {
    console.log("here!");
    console.log("progress", state.played);
    if (!video["seeking"]) {
      setVideo({ ...video, played: state.played, loaded: state.loaded });
    }
  };

  const onStart = () => {
    console.log("start");
  };
  const onError = () => {};
  const onSeek = () => {};

  return {
    onStart,
    onPlay,
    onPause,
    onEnded,
    onError,
    onDuration,
    onSeek,
    onReady,
    onProgress,
  };
};

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

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [video, setVideo] = useState<BaseReactPlayerProps>(initialVideoState);
  const [playList, setPlayList] = useState<PlayList>([]);
  const reactPlayerRef = useRef(null);
  const [videoReady, setVideoReady] = useState<boolean>(false);

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
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

const useVideo = () => {
  return useContext(VideoContext);
};

export default useVideo;
