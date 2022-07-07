import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { messageStore, hostStore } from "./db";

const handleHosts = (io: Server, socket: Socket) => {
  const sId = socket.data.id;
  const rId = socket.data.roomId;
  let activeClients: string[] = [
    ...(io.of("/").adapter.rooms.get(rId) as Set<string>),
  ];
  let isHost = activeClients.length === 1;
  console.log("activeClients", activeClients);
  if (isHost) {
    console.log("host");
    socket.data.isHost = true;
    hostStore.saveHost(sId, rId);
    io.to(sId).emit("host", "you're the host");
  } else {
    console.log("not host");
    socket.data.isHost = false;
    let hostId = hostStore.getHost(rId);
    io.to(hostId).emit("reqPlayList", sId, "bhejde bhai pls!");
    io.to(hostId).emit("reqVideo", sId, "bhejde bhai pls!");
  }
  socket.on("syncHostPlayList", (playList: string[], receiverSId: string) => {
    io.to(receiverSId).emit("syncHostPlayList", playList);
  });
  socket.on("syncHostVideo", (video: any, receiverSId: string) => {
    io.to(receiverSId).emit("syncHostVideo", video);
  });
};

const handleOnConnection = (socket: Socket) => {
  const auth = socket.handshake.auth;
  let name: string = auth.name;
  let roomId: string | null = auth.roomId;
  const imgId: number = Math.floor(Math.random() * 15 + 1);
  if (!roomId) {
    roomId = uuidv4();
  }
  socket.data.name = name;
  socket.data.roomId = roomId;
  socket.data.imgId = imgId;
  socket.join(roomId);
  console.log({
    set: socket.rooms,
    name: socket.data.name,
    img: socket.data.imgId,
  });
  socket.emit("join", name, roomId, imgId);
};

const handleMessaging = (socket: Socket) => {
  socket.on("message", (name, message, imgId) => {
    // console.log({ name, message, imgId });
    let roomId = socket.data.roomId;
    // saving data
    messageStore.saveMessage({ roomId, name, message, imgId });
    socket.broadcast
      .to(socket.data.roomId)
      .emit("message", name, message, imgId);
  });
};

export const handleWebSockets = (io: Server) => {
  console.log("handling web sockets");
  const returnActiveClients = (roomID: string) =>
    io.of("/").adapter.rooms.get(roomID);
  io.on("connection", (socket: Socket) => {
    handleOnConnection(socket);
    handleMessaging(socket);
    handleHosts(io, socket);
  });
};
