import { createContext } from "react";
import { Socket } from "socket.io-client";
import SocketHandler from "../sockets";

export interface Question {
  title: string;
  description: string;
  id: string;
  userID: string;
  classID: string;
  synced: boolean;
  votes: number;
  upvoted: string[];
  downvoted: string[];
  createdAt: string;
  updatedAt: string;
}

interface ISocketContext {
  socket: Socket | null;
  socketHandler: SocketHandler | null;
  questions: Question[];
  resetClass: (slug: string) => void;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  socketHandler: null,
  questions: [],
  resetClass: (slug: string) => {
    return slug;
  },
});
