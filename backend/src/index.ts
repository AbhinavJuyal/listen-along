import express, { Application, Response } from "express";
import morgan from "morgan";
import config from "config";
import { createServer } from "http";
import { Server } from "socket.io";
// import { connectDB } from "./utils/connectDB";
import { handleWebSockets } from "./utils/socket";

const setupMiddlewares = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
};

const bootstrap = () => {
  const app = express();
  setupMiddlewares(app);

  const PORT: number = config.get("port") || 5000;
  const CLIENT_URL: string = config.get("clientURL");

  app.get("/", (_, res: Response) => {
    res.status(200).json("lol noice!");
  });

  // connectDB();

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_URL,
    },
  });

  handleWebSockets(io);

  httpServer.listen(PORT, () => {
    console.log(`Server running in port ${PORT}!!`);
  });
};

bootstrap();
