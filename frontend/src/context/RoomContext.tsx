import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BaseReactPlayerProps } from "react-player/base";
import { IPlayList, IEventsFn, IRoomContext } from "../../@types/video";
import Room from "../pages/Room";
import { botParser } from "../utils/Bot";
import { socket } from "../utils/socket";

const contextEvents = ({
  currentIdx,
  setCurrentIdx,
  setUrl,
  playList,
  video,
  setVideo,
  setVideoReady,
}: IEventsFn) => {
  const changeVideo = useCallback(
    (idx: number, id: string) => {
      console.log("changing video from playlist");
      const ytURL = import.meta.env.VITE_YT_URL;
      const newURL = `${ytURL}${id}`;
      setCurrentIdx(idx);
      console.log("here!");
      setUrl(newURL);
    },
    [setCurrentIdx, setUrl]
  );

  // react-player events
  const onPlay = useCallback(() => {
    console.log("handlePlay");
    setVideo((prev) => ({ ...prev, playing: true }));
    // videoEventEmit("play");
  }, [setVideo]);

  const onPause = useCallback(() => {
    console.log("handlePause");
    setVideo((prev) => ({ ...prev, playing: false }));
    // videoEventEmit("pause");
  }, [setVideo]);

  const onReady = useCallback(() => {
    console.log("readyy");
    setVideoReady(true);
  }, [setVideoReady]);

  const onDuration = useCallback(
    (duration: any) => {
      console.log("duration");
      setVideo((prev) => ({ ...prev, duration }));
    },
    [setVideo]
  );

  const onStart = useCallback(() => {
    console.log("start");
  }, []);

  const onError = useCallback((e: any) => {
    console.log("Error:", e);
  }, []);

  const onSeek = useCallback((sec: number) => {
    console.log("seconds", sec);
  }, []);

  const onEnded = useCallback(() => {
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
  }, [currentIdx, playList, setUrl, setCurrentIdx]);

  const onProgress = useCallback(
    (state: {
      played: number;
      playedSeconds: number;
      loaded: number;
      loadedSeconds: number;
    }): void => {
      setVideo((prev: any) => ({
        ...prev,
        played: state.played,
        loaded: state.loaded,
      }));
    },
    [setVideo]
  );

  const reactPlayerEvents = {
    onStart,
    onPlay,
    onPause,
    onError,
    onDuration,
    onSeek,
    onReady,
    onProgress,
    onEnded,
  };

  return {
    changeVideo,
    reactPlayerEvents,
  };
};

const initialVideoState: BaseReactPlayerProps = {
  pip: false,
  playing: true,
  controls: false,
  light: false,
  volume: 0.8,
  muted: true,
  played: 0,
  loaded: 0,
  duration: 0,
  playbackRate: 1.0,
  loop: false,
};

const RoomContext = React.createContext<IRoomContext | any>({});

export const RoomProvider = () => {
  const [playList, setPlayList] = useState<IPlayList>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [url, setUrl] = useState<string>("");
  const [video, setVideo] = useState<BaseReactPlayerProps>(initialVideoState);
  const reactPlayerRef = useRef<any>(null);
  const [videoReady, setVideoReady] = useState<boolean>(false);

  // socket events
  // video data when first joins the room
  useEffect(() => {
    socket.on("host:request", (receiverSId, message) => {
      console.log("reqData");
      console.log(message);
      const emitData = {
        playList,
        video,
        url,
        currentIdx,
      };
      socket.emit("host:response", emitData, receiverSId);
    });
    socket.on("host:response", (emitData) => {
      console.log("resData", emitData);
      setVideo(emitData.video);
      setCurrentIdx(emitData.currentIdx);
      setPlayList(emitData.playList);
    });
    console.log(socket.listeners("host:response"));
    return () => {
      socket.off("host:request");
      socket.off("host:response");
    };
  }, []);

  useEffect(() => {
    // console.log("playList changing!");
    if (currentIdx === 0 && url === "" && playList.length !== 0) {
      setUrl(`${import.meta.env.VITE_YT_URL}${playList[currentIdx].id}`);
    }
  }, [playList]);

  const fns = contextEvents({
    currentIdx,
    setCurrentIdx,
    setUrl,
    playList,
    video,
    setVideo,
    setVideoReady,
  });

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
    video,
    reactPlayerRef,
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
