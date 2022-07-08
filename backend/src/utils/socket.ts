import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { messageStore, hostStore } from "./db";

const handleOnDisconnect = (io: Server, socket: Socket) => {
  socket.on("disconnecting", () => {
    const rId = socket.data.roomId;
    const sId = socket.id;
    let hostId = hostStore.getHost(rId);
    let activeClients: string[] = [
      ...(io.of("/").adapter.rooms.get(rId) as Set<string>),
    ];
    let isHost = activeClients.length === 1;
    if (isHost) {
      // when there is only one client left
      hostStore.deleteHost(rId);
    }
    // when there are more than one client left
    if (hostId === sId) {
      // if the client is the host
      // find the new host
      let tempId = activeClients.indexOf(hostId);
      activeClients.splice(tempId, 1);
      let newHostId = activeClients[0];
      hostStore.saveHost(newHostId, rId);
      io.to(newHostId).emit("host", "you're the new host");
    }
    // socket.leave(rId);
    console.log(socket.data.name + " left the room");
  });
};

const handleHosts = (io: Server, socket: Socket) => {
  const sId = socket.id;
  const rId = socket.data.roomId;
  let activeClients: string[] = [
    ...(io.of("/").adapter.rooms.get(rId) as Set<string>),
  ];
  let isHost = activeClients.length === 1;
  if (isHost) {
    console.log("host");
    // socket.data.isHost = true;
    hostStore.saveHost(sId, rId);
    console.log("sending out host");
    // socket.emit("message", "server", "you're the host", 1);
    io.to(sId).emit("host", "you're the host");
  } else {
    console.log("not host");
    // socket.data.isHost = false;
    let hostId = hostStore.getHost(rId);
    io.to(hostId).emit("host:request", sId, "bhejde bhai pls!");
  }
  socket.on("host:response", (emitData, receiverSId) => {
    console.log(emitData);
    io.to(receiverSId).emit("host:response", emitData);
  });
};

// @ts-ignore
const handleOnConnect = (io: Server, socket: Socket) => {
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

// @ts-ignore
const handleMessaging = (io: Server, socket: Socket) => {
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
  // const returnActiveClients = (roomID: string) =>
  // io.of("/").adapter.rooms.get(roomID);
  io.on("connection", (socket: Socket) => {
    handleOnConnect(io, socket);
    handleMessaging(io, socket);
    handleHosts(io, socket);
    handleOnDisconnect(io, socket);
  });
};
