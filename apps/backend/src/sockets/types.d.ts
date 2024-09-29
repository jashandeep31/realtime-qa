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
  createdAt: string;
  updatedAt: string;
}
