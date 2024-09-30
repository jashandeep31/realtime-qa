import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useEffect, useState } from "react";
import { Question } from "../../contexts/SocketContext";
import { ArrowLeft } from "lucide-react";

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
      <h1 className="text-lg md:text-2xl font-bold mt-3">{question.title}</h1>
    </div>
  );
};
