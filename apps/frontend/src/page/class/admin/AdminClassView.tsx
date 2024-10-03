import { Button } from "@repo/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSocket } from "../../../hooks/useSocket";
import { useEffect, useState } from "react";
import { Question } from "../../../contexts/SocketContext";
import { useParams } from "react-router-dom";
import AnswerCard from "../../../components/AnswerCard";
import { NotionRenderer } from "react-notion-x";
import { toast } from "sonner";

const AdminClassView = () => {
  const { classSlug } = useParams<{ classSlug: string }>();
  const { questions, resetClass, socketHandler } = useSocket();
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIndex === questions.length - 1) return;
        setCurrentIndex((prev) => prev + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex === 0) return;
        setCurrentIndex((prev) => prev - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [questions.length, currentIndex]);

  const QuestionRender = ({ questions }: { questions: Question[] }) => {
    const question = questions[currentIndex];
    console.log(questions);
    console.log(question);
    if (!question) {
      return <div> No questions </div>;
    }
    return (
      <div>
        <h1 className="text-lg font-bold">
          {question.title} {currentIndex}
        </h1>
        {/* <div className="flex gap-2">
            <Button variant={"outline"}>Upvote</Button>
            <Button variant={"outline"}>Downvote</Button>
            <Button variant={"outline"}>Bookmark</Button>
            <Button variant={"outline"}>Answer</Button>
          </div> */}
        <div className="mt-6">
          <NotionRendererComponent question={question} />
          <Description question={question} />
        </div>
        <div className="mt-6">
          <h1 className="text-lg font-bold">Answers</h1>
          <div>
            {question.answers.map((answer) => (
              <AnswerCard answer={answer} question={question} key={answer.id} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!classSlug) return;
    if (!questions) return;
    if (socketHandler && socketHandler.classID !== classSlug) {
      resetClass(classSlug);
    }
    return () => {};
  }, [classSlug, resetClass, socketHandler, questions]);
  return (
    <div className="md:mt-12 mt-6 container">
      <div className="flex justify-between">
        <div>
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
              {/* <Quesitons questions={questions} /> */}
            </TabsContent>
            <TabsContent value="password"></TabsContent>
            <TabsContent value="password1"></TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              disabled={questions.length === 0 || currentIndex === 0}
              onClick={() => {
                if (currentIndex === 0) return;
                setCurrentIndex((prev) => prev - 1);
              }}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button disabled variant={"outline"}>
              Rearrange{" "}
            </Button>
            <Button variant={"outline"}>Bookmark </Button>

            <Button
              variant={"outline"}
              disabled={
                questions.length === 0 || currentIndex === questions.length - 1
              }
              onClick={() => {
                if (currentIndex === questions.length - 1) return;
                setCurrentIndex((prev) => prev + 1);
              }}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
          <p className="text-right text-sm text-muted-foreground">
            {currentIndex + 1} of {questions.length}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <QuestionRender questions={questions} />
      </div>
    </div>
  );
};

export default AdminClassView;
const Description = ({ question }: { question: Question }) => {
  return (
    <>
      {!question.isNotionLink && (
        <div className="mt-6">
          <div dangerouslySetInnerHTML={{ __html: question.description }} />
        </div>
      )}
    </>
  );
};

const NotionRendererComponent = ({ question }: { question: Question }) => {
  const [notionPage, setNotionPage] = useState(null);

  const getPage = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/test/${id.split("/").reverse()[0]}`
      );
      if (res.status !== 200) {
        throw new Error("Notion page not found");
      }
      const data = await res.json();

      setNotionPage(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || "Notion page not found");
      } else {
        toast.error("Notion page not found");
      }
    }
  };

  useEffect(() => {
    if (!question.isNotionLink) return;
    getPage(question.notionLink);
  }, [question]);

  return (
    <div>
      {notionPage && <NotionRenderer recordMap={notionPage} fullPage={false} />}
    </div>
  );
};
