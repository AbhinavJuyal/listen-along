import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { messageStore } from "./db";

export const handleWebSockets = (io: Server) => {
  console.log("handling web sockets");

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
      console.log({ name, message, imgId });
      let roomId = socket.data.roomId;
      // saving data
      if (!messageStore.checkStoreRoom(roomId))
        messageStore.createStoreRoom(roomId);
      messageStore.mutateStore({ roomId, name, message, imgId });
      console.log(messageStore.store);
      socket.broadcast
        .to(socket.data.roomId)
        .emit("message", name, message, imgId);
    });
  };

  io.on("connection", (socket: Socket) => {
    handleOnConnection(socket);
    handleMessaging(socket);
  });
};
