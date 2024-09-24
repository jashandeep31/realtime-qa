import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";

export default function QuestionCard() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          What is the capital of France?
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          This is a sample question that users can upvote, downvote, and answer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <ArrowUp className="h-5 w-5" />
            </Button>
            <span className="font-bold">23</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              <MessageCircle className="inline mr-1 h-4 w-4" />
              12 Answers
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
