const rooms = require("./db");

const consoleDB = (req, res, next) => console.log(rooms);

module.exports = consoleDB;
