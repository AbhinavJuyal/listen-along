import React from "react";

const VideoPlayList = ({ playList }) => {
  return (
    <div>
      {playList && playList.map((url, idx) => <div key={idx}>{url}</div>)}
    </div>
  );
};

export default VideoPlayList;
