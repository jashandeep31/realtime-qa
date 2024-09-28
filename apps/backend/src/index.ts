import express from "express";
import dotenv from "dotenv";
import passport, { session } from "passport";
import { db } from "@repo/db";
import expressSession from "express-session";
import cors from "cors";
import "./configs/passport.config.js";
import { Redis } from "ioredis";
import RedisStore from "connect-redis";

// routes import
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const client = new Redis({
  host: "localhost",
  port: 6379,
});

const PORT = process.env.PORT || 8000;
const RANDOM_NUMBER = Math.floor(Math.random() * 1000);
const expressSessionConfig: expressSession.SessionOptions = {
  store: new RedisStore({ client: client }),
  secret: "secureme",
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

const app = express();
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

app.get("/", (req, res) => {
  res.send(`Hello World!, ${RANDOM_NUMBER}`);
});

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
