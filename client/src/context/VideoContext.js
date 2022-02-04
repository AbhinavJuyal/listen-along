import React, { useContext, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { socket } from "../services/socket";

const VideoContext = React.createContext();

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
  loop: false,
};

export const VideoProvider = ({ children }) => {
  let [video, setVideo] = useState(initialVideoState);
  let [searchParams] = useSearchParams();
  let room = searchParams.get("room");
  let [playList, setPlayList] = useState([
    1,
    "https://www.youtube.com/watch?v=rqtEGrSGFvw",
  ]);
  let reactPlayerRef = useRef(null);
  let syncState = useRef();

  // emiting video events
  const videoEventEmit = (type, URL) => {
    let data = {};
    console.log("videoEventEmit", video.url);
    switch (type) {
      case "seek":
        data = { playing: video.playing, played: video.played };
        break;
      case "sync":
        data = video;
        break;
      case "playList":
        // error handling required if URL is not given but type is playList
        data = { URL };
        break;
      default:
        console.log("videoEventEmit no type");
    }
    socket.emit("videoEvent", room, type, data);
  };

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
    let data = syncState.current;
    if (data) {
      setVideo(data.video);
      setPlayList(data.playList);
      console.log("easy professional development", data);
      reactPlayerRef.current.seekTo(data.video.played);
      syncState.current = null;
    }
  };

  const handleOnEnded = () => {};

  const handleOnStart = () => {};

  // VideoPlayList functions

  // this works when current video finished
  const handleOnURLChange = (URL) => {
    // setVideo((prev) => ({ ...prev, url: URL }));
    videoEventEmit("URL", URL);
  };

  // when the url is added to the playlist
  const addURLToPlayList = (URL) => {
    console.log("addURLToPlayList", playList.includes(URL));
    if (!playList.includes(URL)) {
      setPlayList((prev) => [...prev, URL]);
      videoEventEmit("playList", URL);
      return;
    }
    console.warn("Video already in the playlist!");
  };

  const value = {
    video,
    setVideo,
    initialVideoState,
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
    handleOnReady,
    handleOnStart,
    handleOnEnded,
    handleOnURLChange,
    addURLToPlayList,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

const useVideo = () => {
  return useContext(VideoContext);
};

export default useVideo;
