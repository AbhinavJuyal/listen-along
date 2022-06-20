import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

export const handleWebSockets = (io: Server) => {
  console.log("handling web sockets");
  // io.use((socket: Socket, next) => {
  //   console.log(socket.handshake.auth.token);
  //   console.log(socket.rooms);
  //   console.log({
  //     set: socket.rooms,
  //     name: socket.data.name,
  //   });
  //   next();
  // });

  io.on("connection", (socket: Socket) => {
    const auth = socket.handshake.auth;
    let name = auth.name;
    let roomId = auth.roomId;
    if (!roomId) {
      roomId = uuidv4();
    }
    socket.data.name = name;
    socket.data.roomId = roomId;
    socket.join(roomId);
    console.log({
      set: socket.rooms,
      name: socket.data.name,
    });
    socket.emit("join", name, roomId);
  });
};
