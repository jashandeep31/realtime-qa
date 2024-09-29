import { Socket } from "socket.io-client";

class SocketHandler {
  socket: Socket;
  classID: string;
  constructor(socket: Socket) {
    this.socket = socket;
    this.classID = "";
  }

  getNewClass(id: string) {
    this.classID = id;
    this.socket.emit("classID", {
      id: id,
    });
  }
  createQuestion(data: { title: string; description: string }) {
    this.socket.emit("newQuestion", { ...data, classID: this.classID });
  }
  getAllQuestions() {
    this.socket.emit("getAllQuestions", { id: this.classID });
  }
}

export default SocketHandler;
