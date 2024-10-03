import { Server as SocketIOServer, Socket } from "socket.io";
import { questionSocketHandler } from "./questions.socket.js";
import { db } from "@repo/db";

export const initSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    // just handling hte classID event
    socket.on("classID", async (data) => {
      socket.join(data.id);
      const classData = await db.liveClass.findUnique({
        where: {
          id: data.id,
        },
      });
      if (!classData) return;
      io.to(socket.id).emit("joined", {
        message: "Joined to class success",
        classID: data.id,
        class: classData,
      });
    });

    questionSocketHandler(socket, io);
  });
};
