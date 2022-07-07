import chalk from "chalk";

interface IMessage {
  name: string;
  message: string;
  imgId: number;
}

interface IMessageStoreInterface {
  [roomId: string]: IMessage[];
}

interface INewMessageStoreObject extends IMessage {
  roomId: string;
}

class MessageStore {
  _messageStore: IMessageStoreInterface;
  constructor() {
    this._messageStore = {};
  }
  get store() {
    return this._messageStore;
  }
  printStore() {
    console.log(chalk.underline.green("Message Store:"));
    console.log(this._messageStore);
  }
  checkStoreRoom(roomId: string) {
    // true if exists
    // false if does not exits
    return typeof this._messageStore[roomId] !== "undefined";
  }
  saveMessage({ roomId, name, message, imgId }: INewMessageStoreObject) {
    // creates store room
    if (!this.checkStoreRoom(roomId)) this._messageStore[roomId] = [];
    this._messageStore[roomId].push({
      name,
      message,
      imgId,
    });
    this.printStore();
  }
}

interface IHostStore {
  [roomId: string]: string;
}

class HostStore {
  _hostStore: IHostStore;
  constructor() {
    this._hostStore = {};
  }
  get store() {
    return this._hostStore;
  }
  printStore() {
    console.log(chalk.underline.green("Host Store:"));
    console.log(this._hostStore);
  }
  checkStoreRoom(roomId: string) {
    // true if exists
    // false if does not exits
    return typeof this._hostStore[roomId] !== "undefined";
  }
  getHost(rId: string) {
    return this._hostStore[rId];
  }
  saveHost(sId: string, rId: string) {
    // creates store room
    // if (!this.checkStoreRoom(rId)) this._hostStore[rId] = sId;
    this._hostStore[rId] = sId;
    this.printStore();
  }
}

export const db = [];
export const messageStore = new MessageStore();
export const hostStore = new HostStore();
