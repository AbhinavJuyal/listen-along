import React, { useEffect } from "react";
import { socket } from "../../services/socket";
import ReactPlayer from "react-player/youtube";
import VideoURLForm from "../VideoURLForm/VideoURLForm";
import VideoControls from "../VideoControls/VideoControls";
import VideoPlayList from "../VideoPlayList/VideoPlayList";
import "./VideoContainer.css";
import useVideo from "../../context/VideoContext";

// https://www.youtube.com/watch?v=v4WsQsRgbls
// https://www.youtube.com/watch?v=rqtEGrSGFvw
// https://www.youtube.com/watch?v=coV6Vc5POhM
// https://www.youtube.com/watch?v=-wpTY3LM5bc

// takayan: "https://www.youtube.com/watch?v=v4WsQsRgbls"
const VideoContainer = ({ room }) => {
  let {
    video,
    setVideo,
    // initialVideoState,
    playList,
    setPlayList,
    reactPlayerRef,
    syncState,
    handlePlayPause,
    handlePlay,
    handlePause,
    handleProgress,
    handleSeekMouseDown,
    handleSeekMouseUp,
    handleSeekChange,
    handleOnStart,
    handleOnReady,
    handleOnEnded,
    // handleOnURLChange,
    addURLToPlayList,
  } = useVideo();

  useEffect(() => {
    socket.on("getHostData", (string, socketID) => {
      console.log(string);
      socket.emit("syncHost", { video, playList }, socketID);
    });
  }, [room, video, playList]);

  useEffect(() => {
    socket.on("videoEvent", (type, data) => {
      console.log("type", type);
      switch (type) {
        case "play":
          setVideo((prev) => ({ ...prev, playing: true }));
          break;
        case "pause":
          setVideo((prev) => ({ ...prev, playing: false }));
          break;
        case "seek":
          setVideo((prev) => ({
            ...prev,
            playing: data.playing,
            played: data.played,
          }));
          reactPlayerRef.current.seekTo(data.played);
          break;
        case "sync":
          console.log("syncState added");
          syncState.current = data;
          break;
        case "playList":
          setPlayList((prev) => [...prev, data.URL]);
          break;
        default:
          console.warn("videoEvent.on() no type!");
      }
    });
  }, [reactPlayerRef, setPlayList, setVideo, syncState]);

  return (
    <div className="video-container">
      <VideoURLForm addURL={addURLToPlayList} />
      <div className="react-player-container">
        <ReactPlayer
          ref={reactPlayerRef}
          url={video.url}
          className="react-player-video"
          width="100%"
          height="100%"
          pip={video["pip"]}
          playing={video["playing"]}
          controls={video["controls"]}
          light={video["light"]}
          loop={video["loop"]}
          playbackRate={video["playbackRate"]}
          volume={video["volume"]}
          muted={video["muted"]}
          onReady={handleOnReady}
          onStart={handleOnStart}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleOnEnded}
          onError={(e) => console.log("onError", e)}
          onProgress={handleProgress}
          // onDuration={handleDuration}
        />
      </div>
      <VideoControls
        video={video}
        handleSeekMouseDown={handleSeekMouseDown}
        handleSeekChange={handleSeekChange}
        handleSeekMouseUp={handleSeekMouseUp}
        handlePlayPause={handlePlayPause}
      />
      <VideoPlayList playList={playList} />
    </div>
  );
};

export default VideoContainer;
