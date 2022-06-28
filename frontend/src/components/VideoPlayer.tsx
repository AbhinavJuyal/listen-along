import ReactPlayer from "react-player/youtube";
import { IVideoContext } from "../../@types/video";
import useVideo from "../context/VideoContext";

const VideoPlayer = () => {
  const { video, events, reactPlayerRef } = useVideo() as IVideoContext;
  return (
    <div className="h-[440px] mx-6">
      <ReactPlayer
        ref={reactPlayerRef}
        width="100%"
        height="100%"
        {...video}
        {...events}
      />
    </div>
  );
};

export default VideoPlayer;
