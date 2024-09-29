import { createContext } from "react";
import { Socket } from "socket.io-client";
import SocketHandler from "../sockets";

interface ISocketContext {
  socket: Socket | null;
  socketHandler: SocketHandler | null;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  socketHandler: null,
});
