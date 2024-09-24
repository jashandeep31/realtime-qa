import { Button } from "@repo/ui/button";
import { HelpCircle, MessageSquare, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Ask Questions in Real-Time
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Get instant answers to your questions. Connect with experts and
                peers in real-time.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg">
                Get Started
                <Zap className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Docs
                <HelpCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
              <Zap className="h-8 w-8 mb-2" />
              <h2 className="text-xl font-bold">Real-Time Answers</h2>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Get answers to your questions instantly from our community of
                experts.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
              <MessageSquare className="h-8 w-8 mb-2" />
              <h2 className="text-xl font-bold">Interactive Discussions</h2>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Engage in meaningful conversations and expand your knowledge.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
              <HelpCircle className="h-8 w-8 mb-2" />
              <h2 className="text-xl font-bold">Diverse Topics</h2>
              <p className="text-center text-gray-500 dark:text-gray-400">
                From tech to arts, find answers on a wide range of subjects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
