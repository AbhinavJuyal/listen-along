import React, { useState, useRef, useEffect } from "react";
import { socket } from "../../services/socket";
import ReactPlayer from "react-player/youtube";
import VideoURLForm from "../VideoURLForm/VideoURLForm";
import VideoControls from "../VideoControls/VideoControls";
import VideoPlayList from "../VideoPlayList/VideoPlayList";
import "./VideoContainer.css";

// https://www.youtube.com/watch?v=v4WsQsRgbls
// https://www.youtube.com/watch?v=rqtEGrSGFvw
const initialVideoState = {
  ready: false,
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
  loop: true,
};

// takayan: "https://www.youtube.com/watch?v=v4WsQsRgbls"
const VideoContainer = ({ room }) => {
  let [video, setVideo] = useState(initialVideoState);
  let [playList, setPlayList] = useState(["sfohoeshfoeshfo"]);
  let reactPlayerRef = useRef(null);
  let syncState = useRef();

  const videoEventEmit = (type, URL) => {
    // emiting video events
    let data = {};
    console.log("videoEventEmit", video.url);
    switch (type) {
      case "seek":
        data = { playing: video.playing, played: video.played };
        break;
      case "sync":
        data = video;
        break;
      case "URL":
        data = { URL };
        break;
      default:
        break;
    }
    socket.emit("videoEvent", room, type, data);
  };

  useEffect(() => {
    socket.on("getHostData", (string, socketID) => {
      console.log(string);
      socket.emit("syncHost", video, socketID);
    });
  }, [video, room]);

  useEffect(() => {
    socket.on("videoEvent", (res, type) => {
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
            playing: res.playing,
            played: res.played,
          }));
          reactPlayerRef.current.seekTo(res.played);
          break;
        case "sync":
          console.log("syncState added");
          syncState.current = res;
          break;
        case "URL":
          setVideo({ ...initialVideoState, url: res.URL });
          break;
        default:
          console.warn("no type!");
      }
    });
  }, []);

  // VideoControls Functions
  const handlePlayPause = () => {
    console.log("handlePlayPause");
    setVideo({ ...video, playing: !video.playing });
    return video.playing;
  };

  const handlePlay = () => {
    console.log("handlePlay");
    setVideo({ ...video, playing: true });
    videoEventEmit("play");
  };

  const handlePause = () => {
    console.log("handlePause");
    setVideo({ ...video, playing: false });
    videoEventEmit("pause");
  };

  const handleProgress = (state) => {
    // console.log("progress", state.played);
    if (!video["seeking"]) {
      setVideo({ ...video, played: state.played, loaded: state.loaded });
    }
  };

  const handleSeekMouseDown = (e) => {
    console.log("handleSeekMouseDown");
    setVideo({ ...video, seeking: true });
  };

  const handleSeekMouseUp = (e) => {
    console.log("handleSeekMouseUp");
    // setVideo and reactPlayerRef order needs to be like this
    setVideo({ ...video, seeking: false });
    reactPlayerRef.current.seekTo(e.target.value);
    videoEventEmit("seek");
  };

  const handleSeekChange = (e) => {
    console.log("handleSeekChange");
    setVideo({ ...video, played: parseFloat(e.target.value) });
  };

  const handleOnReady = () => {
    if (syncState.current) {
      console.log("easy professional development", syncState.current);
      reactPlayerRef.current.seekTo(syncState.current.played);
      syncState.current = null;
    }
  };

  const handleOnStart = () => {};

  // VideoPlayList functions
  const handleOnURLChange = (URL) => {
    setVideo((prev) => ({ ...prev, url: URL }));
    videoEventEmit("URL", URL);
  };

  const addURLToPlayList = (URL) => {
    setPlayList((prev) => [...prev, URL]);
  };

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
