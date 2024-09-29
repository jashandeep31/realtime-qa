import { Socket } from "socket.io-client";

class SocketHandler {
  socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  getNewClass(id: string) {
    this.socket.emit("classID", {
      id: id,
    });
  }
}

export default SocketHandler;
