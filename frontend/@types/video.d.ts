import React from "react";
import { BaseReactPlayerProps } from "react-player/base";

// export type IPlayList = string[];
export type IPlayList = IPlayListInfo[];

export interface IRoomContext {
  [otherProps: string]: any;
}

export interface IEventsFn {
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  playList: IPlayList;
}

export interface IPlayListInfo {
  id: string;
  title: string;
  imgURL: string;
}

export interface IVideoEventsFn {
  video: BaseReactPlayerProps;
  setVideo: React.Dispatch<React.SetStateAction<BaseReactPlayerProps>>;
  setVideoReady: React.Dispatch<React.SetStateAction<boolean>>;
  playList?: PlayList;
  setPlayList?: React.Dispatch<React.SetStateAction<PlayList>>;
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
}

export interface IVideoEvents {
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onClickPreview?: (event: any) => void;
  onError?: (
    error: any,
    data?: any,
    hlsInstance?: any,
    hlsGlobal?: any
  ) => void;
  onDuration?: (duration: number) => void;
  onSeek?: (seconds: number) => void;
  onProgress?: (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => void;
  [otherProps: string]: any;
}

export interface IMessage {
  name: string;
  message: string;
  imgId: number;
}

// export interface IVideoContext {
//   video: BaseReactPlayerProps;
//   playList: PlayList;
//   videoReady: boolean;
//   setVideo: React.Dispatch<React.SetStateAction<IVideo>>;
//   setPlayList: React.Dispatch<React.SetStateAction<PlayList>>;
//   setVideoReady: React.Dispatch<React.SetStateAction<boolean>>;
//   events: IVideoEvents;
//   [otherProps: string]: any;
// }
