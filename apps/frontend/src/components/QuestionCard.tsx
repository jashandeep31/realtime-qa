import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { ArrowDown, ArrowUp, MessageCircle, TrashIcon } from "lucide-react";
import { Question } from "../contexts/SocketContext";
import { useSocket } from "../hooks/useSocket";
import { useSession } from "../hooks/UseSession";
import { Link } from "react-router-dom";

export default function QuestionCard({ question }: { question: Question }) {
  const { socket } = useSocket();
  const { session } = useSession();
  const userID =
    !session.loading && session.authenticated && session.user.id
      ? session.user.id
      : null;
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xl font-bold ">
          <div className="flex items-center justify-between">
            <Link to={`/class/${question.classID}/${question.id}`}>
              <span className="underline">{question.title}</span>
            </Link>
            {!session.loading &&
            session.authenticated &&
            session.user.id === question.userID ? (
              <button
                className="text-red-500 hover:text-red-700  "
                onClick={() => {
                  socket?.emit("deleteQuestion", {
                    id: question.id,
                    classID: question.classID,
                  });
                }}
              >
                <TrashIcon size={15} />
              </button>
            ) : null}
          </div>
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground mt-2">
          {question.isNotionLink
            ? "Notion Link"
            : question.description.replace(/<[^>]*>/g, "").substring(0, 20) +
              "..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              disabled={userID ? question.upvoted.includes(userID) : false}
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => {
                socket?.emit("voteQuestion", {
                  id: question.id,
                  type: "upvote",
                  classID: question.classID,
                });
              }}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            <span className="font-bold">{question.votes}</span>
            <Button
              disabled={userID ? question.downvoted.includes(userID) : false}
              onClick={() => {
                socket?.emit("voteQuestion", {
                  id: question.id,
                  type: "downvote",
                  classID: question.classID,
                });
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              <MessageCircle className="inline mr-1 h-4 w-4" />
              {question.answers.length} Answers
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
