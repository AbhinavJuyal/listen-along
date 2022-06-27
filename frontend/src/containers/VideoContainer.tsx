import VideoPlayer from "../components/VideoPlayer";
import { VideoProvider } from "../context/VideoContext";

const VideoContainer = () => {
  return (
    <>
      <VideoProvider>
        <VideoPlayer />
      </VideoProvider>
    </>
  );
};

export default VideoContainer;
