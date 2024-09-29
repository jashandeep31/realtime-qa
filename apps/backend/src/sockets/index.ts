import { Server as SocketIOServer, Socket } from "socket.io";

export const initSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    socket.on("classID", (data) => {
      console.log(`this s `);
      console.log(socket.id, socket.userId);
      io.to(socket.id).emit("joined", { message: "hi" });
    });
  });
};
