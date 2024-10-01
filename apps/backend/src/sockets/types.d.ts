import { string } from "zod";

export interface Question {
  title: string;
  description: string;
  id: string;
  userID: string;
  classID: string;
  synced: boolean;
  votes: number;
  upvoted: string[];
  downvoted: string[];
  isNotionLink: boolean;
  notionLink: string;
  createdAt: string;
  updatedAt: string;
  answered: boolean;
  answers: Answer[];
}

export interface Answer {
  id: string;
  detail: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  accepted: boolean;
}
