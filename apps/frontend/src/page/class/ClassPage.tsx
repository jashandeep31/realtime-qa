import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import QuestionCard from "../../components/QuestionCard";
import { useSocket } from "../../hooks/useSocket";
import { useEffect } from "react";

const ClassPage = () => {
  const { socketHandler } = useSocket();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (!slug) return;
    if (!socketHandler) return;
    socketHandler.getNewClass(slug);

    return () => {};
  }, [socketHandler, slug]);

  return (
    <div className="container md:mt-12 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold">Class Name</h1>
        <Link
          to="/class/temp/create"
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
            <Quesitons />
          </TabsContent>
          <TabsContent value="password"></TabsContent>
          <TabsContent value="password1"></TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

function Quesitons() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
      <QuestionCard />
      <QuestionCard />
      <QuestionCard />
    </div>
  );
}

export default ClassPage;
