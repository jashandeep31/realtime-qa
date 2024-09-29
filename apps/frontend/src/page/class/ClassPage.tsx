import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import QuestionCard from "../../components/QuestionCard";
import { useSocket } from "../../hooks/useSocket";
import { useEffect } from "react";
import { Question } from "../../contexts/SocketContext";

const ClassPage = () => {
  const { socketHandler, questions, resetClass } = useSocket();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (!slug) return;
    if (!socketHandler) return;
    if (socketHandler && socketHandler.classID !== slug) {
      resetClass(slug);
    }

    return () => {};
  }, [socketHandler, slug, resetClass]);

  return (
    <div className="container md:mt-12 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold">Class Name</h1>
        <Link
          to={`/class/${slug}/create`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Create +
        </Link>
      </div>
      <section className="mt-3">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Questions</TabsTrigger>
            <TabsTrigger value="password">Project/PR showcases</TabsTrigger>
            <TabsTrigger value="password1">Resources</TabsTrigger>
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
