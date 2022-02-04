import React from "react";

const VideoPlayList = ({ playList }) => {
  return (
    <div>
      {playList &&
        playList.map(
          (url, idx) =>
            idx > 0 && (
              <div
                style={{ color: playList[0] === idx ? "red" : "" }}
                key={idx}
              >
                {url}
              </div>
            )
        )}
    </div>
  );
};

export default VideoPlayList;
