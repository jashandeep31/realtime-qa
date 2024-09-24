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

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

const CreateQuestion = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
                name="username"
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
        <div>
          <h3 className="text-muted-foreground font-medium text-sm mb-3">
            Similar Questions
          </h3>
          <QuestionCard />
        </div>
      </section>
    </div>
  );
};

export default CreateQuestion;
