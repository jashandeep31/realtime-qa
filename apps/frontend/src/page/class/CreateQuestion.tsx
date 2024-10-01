import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import QuestionCard from "../../components/QuestionCard";
import { useSocket } from "../../hooks/useSocket";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@repo/ui/label";
import { Checkbox } from "@repo/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  notionLink: z.string().optional(),
});

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { socketHandler, questions, resetClass } = useSocket();
  const { slug } = useParams<{ slug: string }>();
  const [description, setDescription] = useState("");
  const [isNotionLink, setIsNotionLink] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!socketHandler) return;
    socketHandler.createQuestion({
      title: values.title,
      description,
      isNotionLink: isNotionLink,
      notionLink: values.notionLink,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate(`/class/${slug}`);
  }

  useEffect(() => {
    if (!socketHandler) return;
    if (socketHandler.classID !== slug && slug) {
      resetClass(slug);
    }
  }, [socketHandler, slug, resetClass]);

  return (
    <div className="container md:mt-12 mt-6">
      <h1 className="text-lg md:text-2xl font-bold">
        Create Question/PR/Project showcase
      </h1>
      <p className="text-sm text-muted-foreground">
        Please upvote the similar question to yours instead of creating a new.
      </p>
      <section className="md:mt-12 mt-6 grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mongoose not getting installed"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      All the title related to the question in one line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={isNotionLink}
                    onCheckedChange={(e: boolean) => setIsNotionLink(e)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I am using notion for my question showcase
                  </FormLabel>
                  <FormDescription>
                    If you are using notion for your question showcase, please
                    check this box.
                  </FormDescription>
                </div>
              </FormItem>

              {isNotionLink ? (
                <FormField
                  control={form.control}
                  name="notionLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notion Page Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mongoose not getting installed"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add the notion page link here. Make sure the page is
                        public page.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              <div className={`relative ${isNotionLink ? "hidden" : ""}`}>
                <Label className="mb-2 block">Description/Detail</Label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                />
              </div>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "Submitting" : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
        <div>
          <h3 className="text-muted-foreground font-medium text-sm mb-3">
            Similar Questions
          </h3>
          {questions.map((question) => (
            <QuestionCard question={question} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreateQuestion;
