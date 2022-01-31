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
// const consoleDB = require("./dbLogger.js");
const rooms = require("./db.js");

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

io.on("connection", (socket) => {
  const returnClients = (roomID) => io.sockets.adapter.rooms.get(roomID);

  //io handshake
  socket.on("hello!", () => {
    //client-io handshake
    socket.emit("Welcome", "welcome to the server!");
  });

  //when user connects to existing session
  socket.on("join", ({ username, roomID }) => {
    //checks and add user to the db
    let res = userConnect({ socketId: socket.id, roomID, username });
    if (res) {
      console.log("join event:", res.error);
      io.to(socket.id).emit("error", { msg: res.error });
      return;
    }
    socket.username = username; //adding username attribute for further use
    socket.join(roomID);
    // syncing new client with current video state
    // let activeClients = [...returnClients(roomID)];
    // if (activeClients?.size > 1) {
    //   socket
    //     .to(activeClients[0])
    //     .emit("video-state", { lastTS: 0, type: "join" }, (res) => {
    //       socket.emit("video-state", { lastTS: res.lastTS, type: "seek" });
    //     });
    // }
    console.log(`${username} joined ${roomID}`);
    socket.broadcast.to(roomID).emit("server_message", {
      username: "server",
      msg: `${username} has joined the room`,
    });
    const clients = returnClients(roomID);
    console.log(`server ${roomID}: `, clients);
  });

  socket.on("client_message", (data) => {
    io.to(data.roomID).emit("client_message", {
      username: data.username,
      msg: data.msg,
    });
  });

  socket.on("disconnecting", () => {
    let roomsConnected = [...socket.rooms];
    console.log(roomsConnected);
    socket.to(roomsConnected[1]).emit("server_message", {
      username: "server",
      msg: `${socket.username} has left the room`,
    });
    userDisconnect(socket.username, roomsConnected[1]);
    console.log(`${socket.username} disconnected`);
  });

  // catching video-events
  socket.on("video-event", ({ roomID, video, type }) => {
    // broadcasting event to all clients in the room
    socket.broadcast.to(roomID).emit("video-event", {
      video,
      type,
    });
  });
  
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT); //() => //console.log("Server is running on port 5000!"));
