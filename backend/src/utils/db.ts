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

export const db = [];
export const messageStore = new MessageStore();
