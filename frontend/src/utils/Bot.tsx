import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { IPlayList, IPlayListInfo } from "../../@types/video";

const regexURL =
  /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/g;

function checkURL(url: string): boolean {
  // incase full url wasn't provided
  if (!url) return false;
  const regexArr = [...url.matchAll(regexURL)];
  console.log(regexArr);
  // incase when there's is no or multiple matches
  if (regexArr.length === 0 || regexArr.length > 1) return false;
  const tempArr = [...regexArr[0]];
  // incase there's a match but no video id provided
  if (!tempArr[tempArr.length - 1]) return false;
  // tempArr must have these values + videoId
  const checkArr = ["https:", "www.", "youtube.com", "watch", "?v="];
  tempArr.shift();
  tempArr.pop();
  if (checkArr.length !== tempArr.length) return false;
  const result = tempArr.every((e, idx) => checkArr.indexOf(e) === idx);
  return result;
}

function extractId(url: string): string {
  const regexArr = [...url.matchAll(regexURL)];
  const temp = [...regexArr[0]];
  const id = temp[temp.length - 1];
  return id;
}

const extractPlayListInfo = (res: AxiosResponse): IPlayListInfo => {
  const e = res.data.items[0];
  let imgURL = e.snippet.thumbnails.default.url;
  if (Object.keys(e.snippet.thumbnails).includes("standard"))
    imgURL = e.snippet.thumbnails.standard.url;
  return {
    id: e.id,
    title: e.snippet.title,
    imgURL,
    channelTitle: e.snippet.channelTitle,
  };
};

async function getVideoInfo(id: string): Promise<IPlayListInfo | Error> {
  const ytURL: string = import.meta.env.VITE_YT_API_URL;
  const ytAPIKey: string = import.meta.env.VITE_YT_API_KEY;
  const url: string = `${ytURL}?id=${id}&key=${ytAPIKey}&part=snippet`;
  let result: IPlayListInfo;
  try {
    let res: AxiosResponse = await axios.get(url);
    console.log("response", res);
    // video doesnot exist
    if (res.data.items.length === 0)
      return new Error("Bhamiya Sahi URL to daal do");
    result = { ...extractPlayListInfo(res) };
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) console.log("Axios error", error);
    return new Error("Cannot GET Request");
  }
}

export function botParser(
  setPlayList: React.Dispatch<React.SetStateAction<IPlayList>>
) {
  return function (url: string) {
    if (!checkURL(url)) {
      toast.error("Bhamiya kya kar ho yeh");
      return { err: true, message: "Bhamiya kya kar ho yeh" };
    }
    const videoId: string = extractId(url);
    console.log(videoId);
    const info = getVideoInfo(videoId);
    info.then((data) => {
      console.log("info data", data);
      if (data instanceof Error) {
        console.warn(data);
        toast.error(data.message);
        return {
          err: true,
          message: data.message,
        };
      }
      setPlayList((prev) => [...prev, data]);
      toast("Adding video to the playlist", {
        icon: "❤️",
      });
      return {
        err: false,
        message: "Adding video to the playlist.",
      };
    });
  };
}
