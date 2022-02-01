const { rooms } = require("./db");

//when check whether the username already exists in the session or not
const checkUserName = (user) => {
  if (!rooms[user.roomID]) {
    return false;
  }
  let doubt = rooms[user.roomID].some((obj) => obj.username === user.username);
  return doubt;
};

//when user connects to an existing session
const userConnect = (user) => {
  if (!rooms[user.roomID]) {
    rooms[user.roomID] = [];
  } else if (checkUserName(user)) {
    return "Username already exists!"
  }
  rooms[user.roomID].push({ socketID: user.socketID, username: user.username });
  // console.log("DB: ", rooms);
};

//when user leaves the session
const userDisconnect = (username, roomID) => {
  if (rooms[roomID]) {
    rooms[roomID] = rooms[roomID].filter((obj) => obj.username !== username);
  }
  if (rooms[roomID]?.length === 0) {
    delete rooms[roomID];
  }
  // console.log("DB: ",rooms); 
};

module.exports = {
  userConnect,
  checkUserName,
  userDisconnect,
};
