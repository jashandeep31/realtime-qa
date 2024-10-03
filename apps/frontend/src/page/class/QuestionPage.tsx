import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { useCallback, useEffect, useState } from "react";
import { Question } from "../../contexts/SocketContext";
import { ArrowLeft, Check } from "lucide-react";
import QuestionCard from "../../components/QuestionCard";
import { NotionRenderer } from "react-notion-x";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import { Button } from "@repo/ui/button";
import AnswerCard from "../../components/AnswerCard";
import { serialize } from "next-mdx-remote/serialize";
import "react-notion-x/src/styles.css";
import MDXContent from "../../components/MDXContext";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

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
  }, [id, questions]);

  useEffect(() => {
    if (!socketHandler) return;
    if (socketHandler.classID !== slug && slug) {
      resetClass(slug);
    }
  }, [socketHandler, slug, resetClass]);

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
  const [MDXdata, setMDXdata] = useState<MDXRemoteSerializeResult | null>(null);
  const convertImportStatements = (code: string) => {
    // Regular expression to match both types of import statements and capture them
    const importRegex = /(import\s.*?from\s['"].*?['"]"?)/g;

    // Replace all matches of import statements with the formatted text including the raw import statement
    return code.replace(importRegex, "```$1```");
  };

  const mdx = useCallback(async () => {
    return await serialize(
      convertImportStatements(question.description || ""),
      mdxOptions
    );
  }, [question.description]);

  useEffect(() => {
    try {
      (async () => {
        const serializedData = await mdx(); // Await the mdx function properly
        setMDXdata(serializedData);
      })();
    } catch (e) {
      console.log(e, "theei is erro");
    }
  }, [question.description, mdx]);

  return (
    <>
      {!question.isNotionLink && (
        <div className="mt-6">
          {/* You can add your MDX rendering logic here, depending on how you want to handle MDXContent */}
          {/* <div
            className="p-1"
            dangerouslySetInnerHTML={{ __html: question.description }}
          /> */}
          {MDXdata && <MDXContent code={MDXdata} />}
        </div>
      )}
    </>
  );
};

const REHYPE_THEME_OPTIONS = {
  keepBackground: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxOptions: any = {
  parseFrontmatter: true,

  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => (tree: any) =>
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") {
              return;
            }

            let __title__ = "";
            if (codeEl.data?.meta.includes("title=")) {
              const regex = /title="([^"]*)"/;
              const match = codeEl.data?.meta.match(regex);
              __title__ = match ? match[1] : "";
            }

            node.__title__ = __title__;
          }
        }),
      [rehypePrettyCode, REHYPE_THEME_OPTIONS],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => (tree: any) =>
        visit(tree, (node) => {
          if (node?.type === "element") {
            if (!("data-rehype-pretty-code-figure" in node.properties)) {
              return;
            }
            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }
            if (node.__title__) {
              preElement.properties["__title__"] = node.__title__;
            }
          }
        }),
    ],
  },
};
