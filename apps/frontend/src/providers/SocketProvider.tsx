import { io, Socket } from "socket.io-client";
import { SOCKET_IO_URL } from "../config/constants";
import { SocketContext } from "../contexts/SocketContext";
import SocketHandler from "../sockets";
import { useEffect, useState } from "react";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketHandler, setSocketHandler] = useState<SocketHandler | null>(
    null
  );

  useEffect(() => {
    const newSocket = io(SOCKET_IO_URL, {
      withCredentials: true,
      path: "/socket/",
    });
    newSocket.on("connect", () => {
      setSocket(newSocket);
      setSocketHandler(new SocketHandler(newSocket));
    });

    newSocket.onAny((e) => {
      console.log(e);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, socketHandler }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
