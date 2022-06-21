interface Message {
  name: string;
  message: string;
  imgId: number;
}

interface MessageStoreInterface {
  [roomId: string]: Message[];
}

interface NewMessageStoreObject extends Message {
  roomId: string;
}

class MessageStore {
  _messageStore: MessageStoreInterface;
  constructor() {
    this._messageStore = {};
  }
  get store() {
    return this._messageStore;
  }
  checkStoreRoom(roomId: string) {
    return !(typeof this._messageStore[roomId] === "undefined");
  }
  createStoreRoom(roomId: string) {
    this._messageStore[roomId] = [];
  }
  mutateStore({ roomId, name, message, imgId }: NewMessageStoreObject) {
    this._messageStore[roomId].push({
      name,
      message,
      imgId,
    });
  }
}

export const db = [];
export const messageStore = new MessageStore();
