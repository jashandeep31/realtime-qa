import { io, Socket } from "socket.io-client";
import { SOCKET_IO_URL } from "../config/constants";
import { IClass, Question, SocketContext } from "../contexts/SocketContext";
import SocketHandler from "../sockets";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Fuse from "fuse.js";
import { useDebounce } from "@uidotdev/usehooks";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [classData, setclassData] = useState<null | IClass>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rawQuestions, setRawQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [socketHandler, setSocketHandler] = useState<SocketHandler | null>(
    null
  );
  const fuse = useMemo(
    () =>
      new Fuse(rawQuestions, {
        keys: ["title"],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 1,
        shouldSort: true,
        includeScore: true,
        ignoreLocation: true,
        findAllMatches: true,
      }),
    [rawQuestions]
  );

  const resetClass = (slug: string) => {
    if (socketHandler) {
      socketHandler.getNewClass(slug);
      socketHandler.getAllQuestions();
    }
  };
  const arrangeByVotes = () => {
    const sorted = questions.sort((a, b) => b.votes - a.votes);

    setQuestions([...sorted]);
  };

  const searchQuestions = useCallback(() => {
    if (searchQuery.trim() === "") {
      // setQuestions(rawQuestions);
      return;
    }
    const result = fuse.search(searchQuery).map((result) => result.item);
    console.log(result);
    // setQuestions(result);
  }, [fuse, searchQuery]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchQuestions();
    }
  }, [debouncedSearchTerm, searchQuestions]);

  useEffect(() => {
    const newSocket = io(SOCKET_IO_URL, {
      withCredentials: true,
      path: "/socket/",
    });
    newSocket.on("connect", () => {
      setSocket(newSocket);
      setSocketHandler(new SocketHandler(newSocket));
    });

    newSocket.on("joined", (data) => {
      setclassData(data.class);
      toast.info("You have joined the class");
    });

    newSocket.on("allQuestions", (data: Question[]) => {
      const sorted = data.sort((a, b) => b.votes - a.votes);
      setRawQuestions([...sorted]);
      setQuestions([...sorted]);
    });

    newSocket.on("questionCreated", (data) => {
      setQuestions((prev) => [...prev, data]);
    });

    newSocket.on("questionDeleted", (id) => {
      if (!id) return;
      setQuestions((prev) => prev.filter((question) => question.id !== id));
    });
    newSocket.on("questionUpdated", (data) => {
      const id = data.id;
      const question = data.question;
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === id) {
            return question;
          }
          return q;
        })
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketHandler) {
      socketHandler.getAllQuestions();
    }
  }, [socketHandler]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketHandler,
        questions,
        resetClass,
        arrangeByVotes,
        classData,
        setSearchQuery,
        searchQuery,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
