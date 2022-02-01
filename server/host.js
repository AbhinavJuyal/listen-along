const { hosts, rooms } = require("./db.js");

const changeHostOnDisconnect = (roomID) => {
  rooms[roomID].length === 1
    ? delete hosts[roomID]
    : (hosts[roomID] = rooms[roomID][1].socketID);
};

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

module.exports = {
  changeHostOnDisconnect,
  checkHost,
  addHost,
  getHostSocketID,
};
