import VideoPlayer from "../components/VideoPlayer";
import { VideoProvider } from "../context/VideoContext";
import PlayList from "./PlayList";

const VideoContainer = () => {
  return (
    <>
      <VideoProvider>
        <VideoPlayer />
        <PlayList />
      </VideoProvider>
    </>
  );
};

export default VideoContainer;
