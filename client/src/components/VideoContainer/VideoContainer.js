import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as Play } from "../../assets/play.svg";
import { ReactComponent as Pause } from "../../assets/pause.svg";
import { socket } from "../../services/socket";
import ReactPlayer from "react-player/youtube";
import "./VideoContainer.css";

const initialVideoState = {
  url: null,
  pip: false,
  playing: true,
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
  let [link] = useState("https://www.youtube.com/watch?v=rqtEGrSGFvw");
  let reactPlayerRef = useRef(null);

  const videoEventEmit = (type) => {
    // emiting video events
    console.log("type", type);
    console.log("video", video);
    socket.emit("video-event", {
      roomID: room,
      video,
      type,
    });
  };

  useEffect(() => {
    socket.on("video-event", ({ video, type }) => {
      setVideo(video);
      if (type === "seek") {
        reactPlayerRef.current.seekTo(video.played);
      }
    });
  }, []);

  const handlePlayPause = () => {
    console.log("handlePlayPause");
    setVideo({ ...video, playing: !video.playing });
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
    // console.log("handleProgress");
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
    // setLastTS(video.played);
    // videoStateEmit();
  };

  const handleOnStart = () => {
    // setLastTS(video.played);
    // videoStateEmit();
  };

  // useEffect(() => {
  //   const getVideo = async () => {
  //     let yt = axios.create({
  //       baseURL: "https://www.googleapis.com/youtube/v3",
  //       params: {
  //         part: "snippet",
  //         maxResult: 1,
  //         type: "video",
  //         key: "AIzaSyBAhSNgo-ooNq0qEWw594DQRJm5IjEEuaY",
  //       },
  //     });
  //     const response = await yt.get("/search", {
  //       params: {
  //         q: "love you anyway takayan",
  //       },
  //     });
  //     console.log(response);
  //     setLink(
  //       `https://www.youtube.com/embed/${response.data.items[0].id.videoId}`
  //     );
  //   };
  //   getVideo();
  // }, []);

  return (
    <div className="video-container">
      {/* <form>
        <input type="text" placeholder="Enter a link"/>
      </form> */}
      <div className="react-player-container">
        <ReactPlayer
          ref={reactPlayerRef}
          url={link}
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

      <div className="video-controls">
        <div className="video-control-progress">
          <input
            type="range"
            width="100%"
            min={0}
            max={0.999999}
            step="any"
            value={video["played"]}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
        <button className="video-control-play-pause" onClick={handlePlayPause}>
          {video["playing"] ? <Pause /> : <Play />}
        </button>
      </div>
    </div>
  );
};

export default VideoContainer;
