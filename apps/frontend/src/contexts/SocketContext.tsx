import { createContext } from "react";
import { Socket } from "socket.io-client";
import SocketHandler from "../sockets";

export type Question =
  | {
      title: string;
      description: string;
      id: string;
      userID: string;
      classID: string;
      isNotionLink: false;
      notionLink: undefined;
      synced: boolean;
      votes: number;
      upvoted: string[];
      downvoted: string[];
      createdAt: string;
      updatedAt: string;
      answered: boolean;
      answers: Answer[];
    }
  | {
      title: string;
      description: undefined;
      id: string;
      userID: string;
      classID: string;
      isNotionLink: true;
      notionLink: string;
      synced: boolean;
      votes: number;
      upvoted: string[];
      downvoted: string[];
      createdAt: string;
      updatedAt: string;
      answered: boolean;
      answers: Answer[];
    };

export interface Answer {
  id: string;
  detail: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  userName: string;
  accepted: boolean;
}

export interface IClass {
  id: string;
  name: string;
  description: string;
  userId: string;
  expired: boolean;
}

interface ISocketContext {
  socket: Socket | null;
  socketHandler: SocketHandler | null;
  questions: Question[];
  resetClass: (slug: string) => void;
  arrangeByVotes: () => void;
  classData: null | IClass;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  socketHandler: null,
  questions: [],
  resetClass: (slug: string) => {
    return slug;
  },
  classData: null,
  arrangeByVotes: () => {},
  searchQuery: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSearchQuery: (query: string) => {},
});
