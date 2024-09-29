import { io, Socket } from "socket.io-client";
import { SOCKET_IO_URL } from "../config/constants";
import { Question, SocketContext } from "../contexts/SocketContext";
import SocketHandler from "../sockets";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [classID, setClassID] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketHandler, setSocketHandler] = useState<SocketHandler | null>(
    null
  );

  const resetClass = (slug: string) => {
    setClassID(slug);
    if (socketHandler) {
      socketHandler.getNewClass(slug);
    }
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const newSocket = io(SOCKET_IO_URL, {
      withCredentials: true,
      path: "/socket/",
    });
    newSocket.on("connect", () => {
      setSocket(newSocket);
      setSocketHandler(new SocketHandler(newSocket));
    });

    newSocket.on("joined", () => {
      toast.info("You have joined the class");
    });

    newSocket.on("allQuestions", (data) => {
      setQuestions(data);
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
  }, [classID, socketHandler]);

  return (
    <SocketContext.Provider
      value={{ socket, socketHandler, questions, resetClass }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
