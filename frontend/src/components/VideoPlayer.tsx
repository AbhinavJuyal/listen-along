import { useState } from "react";
import ReactPlayer from "react-player/youtube";
import { IVideoContext } from "../../@types/video";
import useVideo from "../context/VideoContext";

const VideoPlayer = () => {
  const { video, events, reactPlayerRef } = useVideo() as IVideoContext;

  const [timer, setTimer] = useState({});

  const onProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }): void => {
    setTimer({
      played: state.played,
      loaded: state.loaded,
    });
  };

  return (
    <div className="h-[440px] mx-6">
      <ReactPlayer
        ref={reactPlayerRef}
        width="100%"
        height="100%"
        {...video}
        onProgress={onProgress}
        {...events}
      />
    </div>
  );
};

export default VideoPlayer;
