import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useEffect, useState } from "react";
import { Question } from "../../contexts/SocketContext";
import { ArrowLeft, Check } from "lucide-react";
import QuestionCard from "../../components/QuestionCard";
import { NotionRenderer } from "react-notion-x";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import { Button } from "@repo/ui/button";
import AnswerCard from "../../components/AnswerCard";

import "react-notion-x/src/styles.css";

export const QuestionPage = () => {
  const { questions, socketHandler, resetClass } = useSocket();
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    if (!id || !questions) return;
    const question = questions.find((q) => q.id === id);
    if (!question) return;
    if (question.isNotionLink) getPage(question.notionLink);
    setQuestion(question);
    console.log(question);
  }, [id, questions]);

  useEffect(() => {
    if (!socketHandler) return;
    if (socketHandler.classID !== slug && slug) {
      resetClass(slug);
    }
  }, [socketHandler, slug, resetClass]);

  const [notionPage, NotionPage] = useState(null);
  const getPage = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/test/${id.split("/").reverse()[0]}`
      );
      if (res.status !== 200) {
        throw new Error("Notion page not found");
      }
      const data = await res.json();

      NotionPage(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || "Notion page not found");
      } else {
        toast.error("Notion page not found");
      }
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="container md:mt-12 mt-6">
      <Link
        to={`/class/${slug}`}
        className="text-sm text-muted-foreground underline inline-flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back
      </Link>
      <div className="mt-3 grid md:grid-cols-5 gap-6">
        <div className="md:col-span-4">
          <h1
            className={`text-lg md:text-2xl font-bold flex items-center  gap-1 flex-wrap ${question.isNotionLink ? "text-center" : null} `}
          >
            <span>{question.title}</span>
            {question.answered && (
              <span>
                <Check
                  size={22}
                  className="bg-green-500 rounded-full p-1 text-white font-bold"
                />
              </span>
            )}
          </h1>

          {notionPage && question.isNotionLink && (
            <NotionRenderer recordMap={notionPage} fullPage={false} />
          )}
          {/* render the description of the question if not the notion page */}
          <Description question={question} />
          <div className="mt-6 md:mt-12">
            <h2 className="text-lg font-bold">Answer</h2>
            <div className={`relative `}>
              <ReactQuill theme="snow" value={answer} onChange={setAnswer} />
              <div className="mt-3">
                <Button
                  onClick={() => {
                    socketHandler?.createAnswer({
                      questionID: question.id,
                      detail: answer,
                    });
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 space-y-6">
            {question.answers.map((answer) => (
              <AnswerCard answer={answer} question={question} key={answer.id} />
            ))}
          </div>
        </div>
        <div className="md:col-span-1 space-y-4 ">
          {questions.map((q) => (
            <QuestionCard question={q} key={q.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

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
