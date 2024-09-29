import { Server as SocketIOServer, Socket } from "socket.io";
import { questionSocketHandler } from "./questions.socket.js";

export const initSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    // just handling hte classID event
    socket.on("classID", (data) => {
      socket.join(data.id);
      io.to(socket.id).emit("joined", {
        message: "Joined to class success",
        classID: data.id,
      });
    });

    questionSocketHandler(socket, io);
  });
};
