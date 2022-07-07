import React, { useContext, useEffect, useState } from "react";
import { IPlayList, IEventsFn, IRoomContext } from "../../@types/video";
import Room from "../pages/Room";
import { botParser } from "../utils/Bot";
import { socket } from "../utils/socket";

const contextEvents = ({
  currentIdx,
  setCurrentIdx,
  setUrl,
  playList,
}: IEventsFn) => {
  const changeVideo = (idx: number, id: string) => {
    console.log("changing video from playlist");
    const ytURL = import.meta.env.VITE_YT_URL;
    const newURL = `${ytURL}${id}`;
    setCurrentIdx(idx);
    console.log("here!");
    setUrl(newURL);
  };

  const onEnded = () => {
    console.log("end of the video");
    // playList changing etc. etc.
    const nextIdx = currentIdx + 1;
    const ytURL = import.meta.env.VITE_YT_URL;
    if (nextIdx > playList.length - 1) {
      console.log("end of the playlist");
      return;
    }
    const nextURL = `${ytURL}${playList[nextIdx].id}`;
    setUrl(nextURL);
    setCurrentIdx(nextIdx);
  };

  return {
    changeVideo,
    onEnded,
  };
};

const RoomContext = React.createContext<IRoomContext | any>({});

// { children }: { children: React.ReactNode }
// "rqtEGrSGFvw",
// "coV6Vc5POhM",
// "v4WsQsRgbls",
// "-wpTY3LM5bc",
// https://www.youtube.com/watch?v=ilvIWL2hSI8
// yt+ https://www.youtube.com/watch?v=coV6Vc5POhM
// {
//   id: "rqtEGrSGFvw",
//   title: "Tokyo - Leat'eq (Lyrics)",
//   imgURL: "https://i.ytimg.com/vi/rqtEGrSGFvw/sddefault.jpg",
//   channelTitle: "Leat'eq",
// },

export const RoomProvider = () => {
  const [playList, setPlayList] = useState<IPlayList>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [url, setUrl] = useState<string>(() =>
    !(playList.length === 0)
      ? `${import.meta.env.VITE_YT_URL}${playList[currentIdx].id}`
      : ""
  );

  useEffect(() => {
    socket.on("reqPlayList", (receiverSId, message) => {
      console.log("reqPlayList");
      console.log(message);
      socket.emit("syncHostPlayList", playList, receiverSId);
    });
    return () => {
      socket.off("reqPlayList");
    };
  }, []);

  useEffect(() => {
    if (currentIdx === 0 && url === "" && playList.length !== 0) {
      setUrl(`${import.meta.env.VITE_YT_URL}${playList[currentIdx].id}`);
    }
  }, [playList]);

  const fns = contextEvents({ currentIdx, setCurrentIdx, setUrl, playList });
  const botAddToPlayList = botParser(setPlayList);

  const value = {
    ...fns,
    playList,
    setPlayList,
    currentIdx,
    setCurrentIdx,
    url,
    setUrl,
    botAddToPlayList,
  };

  return (
    <RoomContext.Provider value={value}>
      <Room />
    </RoomContext.Provider>
  );
};

const useRoom = () => {
  return useContext(RoomContext);
};

export default useRoom;
