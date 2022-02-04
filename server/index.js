const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const {
  userConnect,
  checkUserName,
  userDisconnect,
} = require("./userDetails.js");

const {
  addHost,
  getHostSocketID,
  checkHost,
  changeHostOnDisconnect,
} = require("./host.js");
const { rooms, hosts } = require("./db.js");

//  Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// middleware
// app.use(consoleDB);

//Server running status
app.get("/", (req, res) => {
  res.send("<h1>Server is running at port 5000!</h1>").status(200);
});

app.post("/", (req, res, next) => {
  let user = {
    username: req.body.username,
    roomID: req.body.roomID,
  };
  // validation
  let msg;
  if (!user.username) {
    msg = "Please enter a username";
  } else if (checkUserName(user)) {
    msg = "Try another username. That one's already taken.";
  } else {
    msg = "ok";
    // if roomID doesn't exist, create it
    if (!user.roomID) {
      user.roomID = uuidv4();
      return res.status(200).json({ msg, roomID: user.roomID });
    }
    // if roomID exists
    return res.status(200).json(msg);
  }
  res.status(400).send(msg);
});

const returnClients = (roomID) => io.of("/").adapter.rooms.get(roomID);
const logger = (socket) => {
  const clients = returnClients(socket.roomID);
  console.log(`${socket.username} -> ${socket.roomID}`);
  console.log("DB: ", rooms);
  console.log(`server ${socket.roomID}: `, clients);
  console.log("hosts", hosts);
};

let count = 0;
io.on("connection", (socket) => {
  //io handshake
  socket.on("hello!", () => {
    //client-io handshake
    socket.emit("welcome", "welcome to the server!");
  });

  //user connects
  let userObj = socket.handshake.auth;
  let fnResult = userConnect({ ...userObj, socketID: socket.id });
  if (fnResult) {
    socket.emit("error", { message: fnResult });
  }
  socket.username = userObj.username; //  adding username attribute for further use
  socket.roomID = userObj.roomID; //  adding roomID attribute for further use
  socket.join(userObj.roomID); // joining room

  // should socket be a host or not
  let activeClients = [...returnClients(socket.roomID)];
  let isHost = activeClients?.length === 1;
  if (isHost) {
    // socket is the host
    console.log("host");
    // socket.isHost = true;
    addHost(socket.id, socket.roomID);
    io.to(socket.id).emit("host", "you're the host");
  } else {
    // socket is not the host
    console.log("not host");
    // socket.isHost = false;
    let hostSocketID = getHostSocketID(socket.roomID);
    // sync with host start
    count++;
    console.log(count);
    io.to(hostSocketID).emit("getHostData", "bhejde bhai pls!", socket.id);
  }

  socket.broadcast.to(socket.roomID).emit("server_message", {
    username: "server",
    msg: `${socket.username} has joined the room`,
  });

  // syncing new client with host
  socket.on("syncHost", (data, socketID) => {
    // console.log("data recieved by server", video);
    io.to(socketID).emit("videoEvent", "sync", data);
  });

  socket.on("client_message", (data) => {
    io.to(data.roomID).emit("client_message", {
      username: data.username,
      msg: data.msg,
    });
  });

  socket.on("disconnecting", () => {
    let roomID = socket.roomID;
    if (checkHost(socket.id, roomID)) {
      changeHostOnDisconnect(roomID);
      io.to(getHostSocketID(roomID)).emit("host", "you're the new host");
    }
    socket.to(roomID).emit("server_message", {
      username: "server",
      msg: `${socket.username} has left the room`,
    });
    userDisconnect(socket.username, roomID);
    console.log(`${socket.username} disconnected`);
    // logger(socket);
  });

  // catching video events
  socket.on("videoEvent", (roomID, type, data) => {
    // broadcasting event to all except sender clients in the room
    socket.broadcast.to(roomID).emit("videoEvent", type, data);
  });

  // logger function because socket.io middleware causing network problems
  // check network tab after adding logger middleware
  // logger(socket);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT); //() => //console.log("Server is running on port 5000!"));
