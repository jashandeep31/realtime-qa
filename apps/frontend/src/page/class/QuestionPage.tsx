import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useEffect, useState } from "react";
import { Question } from "../../contexts/SocketContext";
import { ArrowLeft, Check } from "lucide-react";
import QuestionCard from "../../components/QuestionCard";
import { NotionRenderer } from "react-notion-x";
// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import { Button } from "@repo/ui/button";
import { useSession } from "../../hooks/UseSession";

export const QuestionPage = () => {
  const { questions, socketHandler, resetClass } = useSocket();
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const { session } = useSession();
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
          {!question.isNotionLink && (
            <div className="mt-6">
              <div dangerouslySetInnerHTML={{ __html: question.description }} />
            </div>
          )}

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
              <div key={answer.id}>
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
                      session.user.id === question.userID &&
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
