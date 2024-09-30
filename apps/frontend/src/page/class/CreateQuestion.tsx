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

const formSchema = z.object({
  title: z.string().min(2).max(50),
});

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { socketHandler, questions, resetClass } = useSocket();
  const { slug } = useParams<{ slug: string }>();
  const [description, setDescription] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!socketHandler) return;
    socketHandler.createQuestion({
      title: values.title,
      description,
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
              <div className="relative">
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
