import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useEffect, useState } from "react";
import { Question } from "../../contexts/SocketContext";
import { ArrowLeft } from "lucide-react";
import QuestionCard from "../../components/QuestionCard";

export const QuestionPage = () => {
  const { questions, socketHandler, resetClass } = useSocket();
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!id || !questions) return;
    const question = questions.find((q) => q.id === id);
    if (!question) return;
    console.log(questions);
    setQuestion(question);
  }, [id, questions]);

  useEffect(() => {
    if (!socketHandler) return;
    if (socketHandler.classID !== slug && slug) {
      resetClass(slug);
    }
  }, [socketHandler, slug, resetClass]);

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
          <h1 className="text-lg md:text-2xl font-bold ">{question.title}</h1>

          <div className="mt-6">
            <div dangerouslySetInnerHTML={{ __html: question.description }} />
          </div>
          <div className="mt-6 md:mt-12">
            <h2 className="text-lg font-bold">Answer</h2>
            <textarea
              className="w-full h-48 border rounded-md p-2 mt-2  block"
              placeholder="Type your answer here..."
            ></textarea>
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
