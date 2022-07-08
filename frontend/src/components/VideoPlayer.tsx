import React, { useEffect, useRef, useState } from "react";
import { BaseReactPlayerProps } from "react-player/base";
import ReactPlayer from "react-player/youtube";
import {
  IPlayList,
  IRoomContext,
  IVideoEvents,
  IVideoEventsFn,
} from "../../@types/video";
import useRoom from "../context/RoomContext";
import { socket } from "../utils/socket";

interface IProps {
  playList?: IPlayList;
  currentIdx: number;
  url: string;
  setPlayList?: React.Dispatch<React.SetStateAction<IPlayList>>;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  onEnded: () => void;
}

const VideoPlayer = () => {
  const { video, url, reactPlayerEvents, reactPlayerRef } =
    useRoom() as IRoomContext;

  useEffect(() => {
    socket.on("reqVideo", (receiverSId, message) => {
      console.log("reqVideo");
      console.log(message);
      socket.emit("syncHostVideo", video, receiverSId);
    });
    return () => {
      socket.off("reqVideo");
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="text-gray-primary text-lg font-bold mb-4 ml-6">
        Now Playing
      </div>
      <div className="h-[320px] mx-6">
        <ReactPlayer
          ref={reactPlayerRef}
          className="bg-slate-400"
          width="100%"
          height="100%"
          url={url}
          {...video}
          {...reactPlayerEvents}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
