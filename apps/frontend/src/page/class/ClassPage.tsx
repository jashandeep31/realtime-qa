import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import QuestionCard from "../../components/QuestionCard";
import { useSocket } from "../../hooks/useSocket";
import { useEffect } from "react";
import { Question } from "../../contexts/SocketContext";
import QuestionDialog from "../../components/QuestionDialog";
import { useSession } from "../../hooks/UseSession";

const ClassPage = () => {
  const { session } = useSession();
  const { socketHandler, questions, resetClass, arrangeByVotes, classData } =
    useSocket();
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => {
    if (!slug) return;
    if (!socketHandler) return;
    console.log(socketHandler.intialized);
    if (!socketHandler.intialized) {
      console.log(slug, `we worked`);
      resetClass(slug);
    }
    if (socketHandler && socketHandler.classID !== slug && slug) {
      console.log(`this`);
      resetClass(slug);
    }

    return () => {};
  }, [socketHandler, slug, resetClass]);
  if (session.loading || !session.authenticated) return;

  return (
    <div className="container md:mt-12 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold">Class Name</h1>
        <div className="flex gap-1">
          {classData?.userId === session.user.id && (
            <Link
              to={`/class/${classData.id}/admin`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Admin View
            </Link>
          )}
          <Button variant="secondary" onClick={arrangeByVotes}>
            Arrange by votes
          </Button>
          <Link
            to={`/class/${slug}/create`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Create +
          </Link>
        </div>
      </div>
      <QuestionDialog />
      <section className="mt-3">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Questions</TabsTrigger>
            <TabsTrigger disabled value="password">
              Project/PR showcases (soon)
            </TabsTrigger>
            <TabsTrigger disabled value="password1">
              Resources (soon)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Quesitons questions={questions} />
          </TabsContent>
          <TabsContent value="password"></TabsContent>
          <TabsContent value="password1"></TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

function Quesitons({ questions }: { questions: Question[] }) {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
      {questions.map((question, index) => (
        <QuestionCard question={question} key={index} />
      ))}
    </div>
  );
}

export default ClassPage;
