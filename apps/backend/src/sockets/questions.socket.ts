import { Socket, Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../configs/redis.config.js";
import { Answer, Question } from "./types.js";
import { z } from "zod";
const questionSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().optional(),
  classID: z.string().min(2),
  notionLink: z.string().optional(),
  isNotionLink: z.boolean(),
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
    isNotionLink: question.isNotionLink === "true" ? true : false,
    votes: parseInt(question.votes),
    answers: JSON.parse(question.answers),
    answered: question.answered === "true" ? true : false,
    synced: question.synced === "true" ? true : false,
  };
};
const convertQuestionJSONToString = (question: Question) => {
  return {
    ...question,
    upvoted: JSON.stringify(question.upvoted),
    downvoted: JSON.stringify(question.downvoted),
    isNotionLink: question.isNotionLink.toString(),
    votes: question.votes.toString(),
    answers: JSON.stringify(question.answers),
    answered: question.answered.toString(),
    synced: question.synced.toString(),
  };
};
export const questionSocketHandler = (socket: Socket, io: SocketIOServer) => {
  socket.on("newQuestion", async (data) => {
    const id = uuidv4();

    const validationResult = questionSchema.safeParse(data);
    if (!validationResult.success) {
      console.log(validationResult.error);
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
      isNotionLink: data.isNotionLink,
      notionLink: data.notionLink,
      votes: 0,
      upvoted: [],
      downvoted: [],
      answered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answers: [],
    };

    await redisClient.hmset(
      `question:${id}`,
      convertQuestionJSONToString(question)
    );
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
          return convertQuestionToJSON(question);
        } catch (e) {
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
    if (!id || !type || !classID) return;

    if (type !== "upvote" && type !== "downvote") return;
    const questionData = await redisClient.hgetall(`question:${id}`);
    const validatedQuestion = fullQuestionSchema.safeParse({
      ...questionData,
      upvoted: JSON.parse(questionData.upvoted || "[]"),
      downvoted: JSON.parse(questionData.downvoted || "[]"),
      votes: parseInt(questionData.votes ?? "0"),
      isNotionLink: questionData.isNotionLink === "true" ? true : false,
      synced: questionData.synced === "true" ? true : false,
    });

    // questionData.votes = votes + 1;
    if (validatedQuestion.error) {
      return;
    }

    questionData.synced = "false";

    // ! handle oposite vote properly currently is just change count 1 by 1

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

  socket.on("newAnswer", async (data) => {
    try {
      const questionID = data.questionID;
      const id = uuidv4();
      const detail = data.detail;
      const classID = data.classID;
      if (!questionID || !detail || !classID) return;
      const answer: Answer = {
        id,
        detail,
        userName: socket.user.name,
        userId: socket.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionId: questionID,
        accepted: false,
      };
      const quesiton = await redisClient.hgetall(`question:${questionID}`);
      if (!quesiton) return;
      const convertedQuestion = convertQuestionToJSON(quesiton);
      convertedQuestion.answers.push(answer);

      await redisClient.hmset(
        `question:${questionID}`,
        convertQuestionJSONToString(convertedQuestion)
      );
      await redisClient.hmset(`answer:${id}`, answer);
      await redisClient.sadd("answerIds", id);
      io.to(classID).emit("questionUpdated", {
        id: convertedQuestion.id,
        question: convertedQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("acceptAnswer", async ({ questionID, answerID, classID }) => {
    try {
      if (!questionID || !answerID || !classID) return;
      const question = await redisClient.hgetall(`question:${questionID}`);
      const answer = await redisClient.hgetall(`answer:${answerID}`);
      if (!question || !answer) return;
      const convertedQuestion = convertQuestionToJSON(question);
      if (convertedQuestion.userID !== socket.userId) return;
      if (convertedQuestion.answered) return;
      convertedQuestion.answered = true;
      convertedQuestion.answers = convertedQuestion.answers.map((a: Answer) => {
        if (a.id === answerID) {
          a.accepted = true;
        } else {
          a.accepted = false;
        }
        return a;
      });
      // ! also update the answer which
      await redisClient.hmset(
        `question:${questionID}`,
        convertQuestionJSONToString(convertedQuestion)
      );
      io.to(classID).emit("questionUpdated", {
        id: questionID,
        question: convertedQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  });
};
