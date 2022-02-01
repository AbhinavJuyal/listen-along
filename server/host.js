const { hosts } = require("./db.js");

const checkHost = (socketID, roomID) => {
  return hosts[roomID] === socketID;
};

const addHost = (socketID, roomID) => {
  if (!checkHost(socketID, roomID)) {
    hosts[roomID] = socketID;
    return true;
  }
  return false;
};

const getHostSocketID = (roomID) => hosts[roomID];

module.exports = { checkHost, addHost, getHostSocketID };
