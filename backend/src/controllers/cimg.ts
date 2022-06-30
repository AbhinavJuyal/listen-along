import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

const axiosWorker = async (url: string, videoId: string): Promise<any> => {
  const dir = path.resolve(__dirname, "../../public/cache", `${videoId}.jpg`);
  console.log(dir);
  const writer = fs.createWriteStream(dir);
  try {
    let response: AxiosResponse = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (err) {
    if (axios.isAxiosError(err)) console.log("Error", err);
  }
};

const downloadImg = (req: Request, res: Response): void => {
  const { imgURL, videoId } = req.body;
  axiosWorker(imgURL, videoId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export { downloadImg };
