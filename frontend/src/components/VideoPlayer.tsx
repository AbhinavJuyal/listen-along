import React, { useEffect, useRef, useState } from "react";
import { BaseReactPlayerProps } from "react-player/base";
import ReactPlayer from "react-player/youtube";
import {
  IPlayList,
  IRoomContext,
  IVideoEvents,
  IVideoEventsFn,
} from "../../@types/video";
import useRoom from "../context/RoomContext";
import { socket } from "../utils/socket";

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
  playing: true,
  controls: false,
  light: false,
  volume: 0.8,
  muted: true,
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
    setVideo((prev: any) => ({
      ...prev,
      played: state.played,
      loaded: state.loaded,
    }));
  };

  return {
    onStart,
    onPlay,
    onPause,
    onError,
    onDuration,
    onSeek,
    onReady,
    onProgress,
  };
};

const VideoPlayer = () => {
  const { playList, currentIdx, setCurrentIdx, url, onEnded } =
    useRoom() as IRoomContext;
  const [video, setVideo] = useState<BaseReactPlayerProps>(initialVideoState);
  const reactPlayerRef = useRef<any>(null);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const events: IVideoEvents = videoEvents({
    video,
    setVideo,
    setVideoReady,
    currentIdx,
    setCurrentIdx,
  });

  useEffect(() => {
    socket.on("reqVideo", (receiverSId, message) => {
      console.log("reqVideo");
      console.log(message);
      socket.emit("syncHostVideo", video, receiverSId);
    });
    return () => {
      socket.off("reqVideo");
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="text-gray-primary text-lg font-bold mb-4 ml-6">
        Now Playing
      </div>
      <div className="h-[320px] mx-6">
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
    </div>
  );
};

export default VideoPlayer;
