import React, { useRef, useState } from "react";
import { BaseReactPlayerProps } from "react-player/base";
import ReactPlayer from "react-player/youtube";
import { IPlayList, IVideoEvents, IVideoEventsFn } from "../../@types/video";

interface IProps {
  playList?: IPlayList;
  currentIdx: number;
  url: string;
  setPlayList?: React.Dispatch<React.SetStateAction<IPlayList>>;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  onEnded: () => void;
}

const initialVideoState: BaseReactPlayerProps = {
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

  const onProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }): void => {
    setVideo((prev) => ({
      ...prev,
      played: state.played,
      loaded: state.loaded,
    }));
  };

  return {
    onStart,
    onPlay,
    onPause,
    // onEnded,
    onError,
    onDuration,
    onSeek,
    onReady,
    onProgress,
  };
};

const VideoPlayer = ({
  playList,
  currentIdx,
  setCurrentIdx,
  url,
  onEnded,
}: IProps) => {
  const [video, setVideo] = useState<BaseReactPlayerProps>(initialVideoState);
  const reactPlayerRef = useRef<any>(null);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const events: IVideoEvents = videoEvents({
    video,
    setVideo,
    setVideoReady,
    playList,
    currentIdx,
    setCurrentIdx,
  });

  return (
    <div className="h-[440px] mx-6">
      <ReactPlayer
        ref={reactPlayerRef}
        className="bg-slate-400"
        width="100%"
        height="100%"
        onEnded={onEnded}
        url={url}
        {...video}
        {...events}
      />
    </div>
  );
};

export default VideoPlayer;
