import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
});

console.log("inside socket.tsx", socket);

socket.on("host", (msg) => console.log(msg));

socket.on("disconnect", (reason, desc) => {
  if (reason === "io server disconnect") {
    // the disconnection was initiated by the server, you need to reconnect manually
    // socket.connect();
    console.log("Error: Server Interrupt");
    return;
  }
  console.log("disconnection", reason);
  // temporary: deletes the key:value in localStorage
  // handleLocalStorage();
});

socket.on("connect_error", (error) => {
  console.log("Error: Middleware Interrupt or low-level connection", error);
});

socket.on("connect", () => {
  const engine = socket.io.engine;
  console.log("engine", engine.transport.name); // in most cases, prints "polling"

  engine.once("upgrade", () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log("engine", engine.transport.name); // in most cases, prints "websocket"
  });
});

socket.io.on("error", (error) => {
  console.error("connection error found");
});
