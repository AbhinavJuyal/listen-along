import React from "react";
import { ReactComponent as Play } from "../../assets/play.svg";
import { ReactComponent as Pause } from "../../assets/pause.svg";

const VideoControls = ({
  video,
  handleSeekMouseDown,
  handleSeekChange,
  handleSeekMouseUp,
  handlePlayPause,
}) => {
  return (
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
  );
};

export default VideoControls;
