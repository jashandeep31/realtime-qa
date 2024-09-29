import { Socket, Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../configs/redis.config.js";
import { Question } from "./types.js";
import { z } from "zod";
const questionSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  classID: z.string().min(2),
});

const fullQuestionSchema = questionSchema.extend({
  id: z.string(),
  userID: z.string(),
  synced: z.boolean(),
  votes: z.number(),
  upvoted: z.array(z.string()),
  downvoted: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const convertQuestionToJSON = (question: any) => {
  return {
    ...question,
    upvoted: JSON.parse(question.upvoted),
    downvoted: JSON.parse(question.downvoted),
    votes: parseInt(question.votes),
  };
};

export const questionSocketHandler = (socket: Socket, io: SocketIOServer) => {
  socket.on("newQuestion", async (data) => {
    const id = uuidv4();

    const validationResult = questionSchema.safeParse(data);
    if (!validationResult.success) {
      socket.emit("validationError", validationResult.error.errors);
      return; // Exit if validation fails
    }

    const question: Question = {
      title: data.title,
      description: data.description,
      id: id,
      userID: socket.userId,
      classID: data.classID,
      synced: false,
      votes: 0,
      upvoted: [],
      downvoted: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await redisClient.hmset(`question:${id}`, {
      ...question,
      upvoted: JSON.stringify(question.upvoted),
      downvoted: JSON.stringify(question.downvoted),
    });
    await redisClient.sadd("questionIds", id);
    await redisClient.expire(`question:${id}`, 60 * 60 * 3);

    io.to(question.classID).emit("questionCreated", question);
  });

  socket.on("getAllQuestions", async (data) => {
    if (!data || !data.id) return;
    const questionIds = await redisClient.smembers("questionIds");

    const questions = await Promise.all(
      questionIds.map(async (id) => {
        try {
          const question = await redisClient.hgetall(`question:${id}`);
          if (question.classID !== data.id) return null;
          console.log(question);
          return convertQuestionToJSON(question);
        } catch (e) {
          console.log(e);
          return null;
        }
      })
    );
    const filteredQuestions = questions.filter((question) => question !== null);
    io.to(socket.id).emit("allQuestions", filteredQuestions);
  });

  socket.on("deleteQuestion", async ({ id, classID }) => {
    if (!id) return;
    const question = await redisClient.hgetall(`question:${id}`);
    if (question.userID !== socket.userId) return;

    await redisClient.del(`question:${id}`);
    await redisClient.srem("questionIds", id);
    io.to(classID).emit("questionDeleted", id);
  });
  socket.on("voteQuestion", async ({ id, type, classID }) => {
    if (!id || !type) return;
    if (type !== "upvote" && type !== "downvote") return;
    const questionData = await redisClient.hgetall(`question:${id}`);
    const validatedQuestion = fullQuestionSchema.safeParse({
      ...questionData,
      upvoted: JSON.parse(questionData.upvoted || "[]"),
      downvoted: JSON.parse(questionData.downvoted || "[]"),
      votes: parseInt(questionData.votes ?? "0"),
      synced: questionData.synced === "true" ? true : false,
    });

    // questionData.votes = votes + 1;
    if (validatedQuestion.error) {
      return;
    }

    questionData.synced = "false";

    if (type === "upvote") {
      if (validatedQuestion.data.upvoted.includes(socket.userId)) return;
      questionData.votes = (validatedQuestion.data.votes + 1).toString();
      questionData.upvoted = JSON.stringify([
        ...validatedQuestion.data.downvoted,
        socket.userId,
      ]);
      questionData.downvoted = JSON.stringify(
        validatedQuestion.data.downvoted.filter(
          (userId) => userId !== socket.userId
        )
      );
    }
    if (type === "downvote") {
      if (validatedQuestion.data.downvoted.includes(socket.userId)) return;
      questionData.votes = (validatedQuestion.data.votes - 1).toString();
      questionData.downvoted = JSON.stringify([
        ...validatedQuestion.data.downvoted,
        socket.userId,
      ]);
      questionData.upvoted = JSON.stringify(
        validatedQuestion.data.upvoted.filter(
          (userId) => userId !== socket.userId
        )
      );
    }
    await redisClient.hmset(`question:${id}`, questionData);

    io.to(classID).emit("questionUpdated", {
      id,
      question: convertQuestionToJSON(questionData),
    });
  });
};
