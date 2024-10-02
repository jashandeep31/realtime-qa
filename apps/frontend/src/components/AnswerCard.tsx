import { Check } from "lucide-react";
import { Answer, Question } from "../contexts/SocketContext";
import { useSession } from "../hooks/UseSession";
import { Button } from "@repo/ui/button";
import { useSocket } from "../hooks/useSocket";

const AnswerCard = ({
  answer,
  question,
}: {
  answer: Answer;
  question: Question;
}) => {
  const { session } = useSession();
  const { socketHandler } = useSocket();

  return (
    <div>
      <div className="border p-2 rounded text-sm">
        <h5 className="font-bold flex items-center gap-1 flex-wrap">
          <span>{answer.userName}</span>
          {question.answered && answer.accepted && (
            <span>
              <Check
                size={16}
                className="bg-green-500 rounded-full  text-white font-bold"
              />
            </span>
          )}
        </h5>
        <div
          className="p-1"
          dangerouslySetInnerHTML={{ __html: answer.detail }}
        />
        <div className="flex justify-end gap-2">
          {!session.loading &&
            session.authenticated &&
            question.userID === session.user.id &&
            !question.answered && (
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => {
                  socketHandler?.acceptAnswer({
                    questionID: question.id,
                    answerID: answer.id,
                  });
                }}
              >
                Accept Answer
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
