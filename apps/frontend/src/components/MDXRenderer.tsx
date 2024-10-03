import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import { useCallback, useEffect, useState } from "react";
import MDXContent from "./MDXContext";
import { toast } from "sonner";

const MDXRenderer = ({ code }: { code: string }) => {
  const [MDXdata, setMDXdata] = useState<MDXRemoteSerializeResult | null>(null);
  const convertImportStatements = (code: string) => {
    const importRegex = /(import\s.*?from\s['"].*?['"]"?)/g;
    return code.replace(importRegex, "```$1```");
  };

  const mdx = useCallback(async () => {
    return await serialize(convertImportStatements(code), mdxOptions);
  }, [code]);

  useEffect(() => {
    try {
      (async () => {
        const serializedData = await mdx();
        setMDXdata(serializedData);
      })();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast.error("Something went wrong in the MDXRenderer");
    }
  }, [code, mdx]);

  if (!MDXdata) return <div>Loading...</div>;

  return <>{MDXdata && <MDXContent code={MDXdata} />}</>;
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

export default MDXRenderer;
