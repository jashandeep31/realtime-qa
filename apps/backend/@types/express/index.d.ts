import { Socket as SocketIO } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user: { id: string };
    }
  }
}

declare module "socket.io" {
  interface Socket extends SocketIO {
    user: {
      name: string;
    };
    userId: string;
  }
}
