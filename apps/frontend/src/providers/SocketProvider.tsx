import { io, Socket } from "socket.io-client";
import { SOCKET_IO_URL } from "../config/constants";
import { IClass, Question, SocketContext } from "../contexts/SocketContext";
import SocketHandler from "../sockets";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [classData, setclassData] = useState<null | IClass>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketHandler, setSocketHandler] = useState<SocketHandler | null>(
    null
  );

  const resetClass = (slug: string) => {
    if (socketHandler) {
      socketHandler.getNewClass(slug);
      socketHandler.getAllQuestions();
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

    newSocket.on("joined", (data) => {
      setclassData(data.class);
      toast.info("You have joined the class");
    });

    newSocket.on("allQuestions", (data: Question[]) => {
      const sorted = data.sort((a, b) => b.votes - a.votes);
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

  const arrangeByVotes = () => {
    const sorted = questions.sort((a, b) => b.votes - a.votes);
    setQuestions([...sorted]);
  };
  return (
    <SocketContext.Provider
      value={{
        socket,
        socketHandler,
        questions,
        resetClass,
        arrangeByVotes,
        classData,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
