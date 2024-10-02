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
  createQuestion(data: {
    title: string;
    description: string;
    isNotionLink: boolean;
    notionLink: string | undefined;
  }) {
    console.log(this.classID, { ...data });
    this.socket.emit("newQuestion", { ...data, classID: this.classID });
  }
  getAllQuestions() {
    this.socket.emit("getAllQuestions", { id: this.classID });
  }
  createAnswer({ questionID, detail }: { questionID: string; detail: string }) {
    this.socket.emit("newAnswer", {
      classID: this.classID,
      questionID,
      detail,
    });
  }
  acceptAnswer({
    questionID,
    answerID,
  }: {
    questionID: string;
    answerID: string;
  }) {
    this.socket.emit("acceptAnswer", {
      classID: this.classID,
      questionID,
      answerID,
    });
  }
}

export default SocketHandler;
