import express from "express";
import dotenv from "dotenv";
import passport, { session } from "passport";
import expressSession from "express-session";
import cors from "cors";
import "./configs/passport.config.js";
import { Redis } from "ioredis";
import RedisStore from "connect-redis";
import { createServer } from "node:http";
import * as z from "zod";

// routes import
import authRoutes from "./routes/auth.routes.js";
import classRoutes from "./routes/class.routes.js";
import { Server, Socket } from "socket.io";
import { initSocket } from "./sockets/index.js";
import { ApplicationError } from "./lib/appError.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const RANDOM_NUMBER = Math.floor(Math.random() * 1000);
const client = new Redis({
  host: "localhost",
  port: 6379,
});
const expressSessionConfig: expressSession.SessionOptions = {
  store: new RedisStore({ client: client }),
  secret: "secureme",
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/socket/",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const sessionMiddleware = expressSession(expressSessionConfig);
const wrap = (middleware: any) => (socket: SessionSocket, next: any) =>
  middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use((socket: Socket, next) => {
  try {
    // ! tempering with the types of the session
    const user = (socket.request as any).session?.passport.user;
    const userShema = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    });
    const { error: userError } = userShema.safeParse(user);
    if (userError) {
      return next(new ApplicationError("Unauthorized", 400));
    } else {
      socket.user = null;
      socket.userId = user.id;
      next();
    }
  } catch (e) {
    console.log(e);
    return next(new ApplicationError("Unauthorized", 400));
  }
});

initSocket(io);

app.use(express.json());
app.use(expressSession(expressSessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

interface SessionSocket extends Socket {
  request: any;
}

app.get("/", (req, res) => {
  res.send(`Hello World!, ${RANDOM_NUMBER}`);
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/class", classRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
