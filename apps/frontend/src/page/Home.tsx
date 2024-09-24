import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Link } from "react-router-dom";
import ClassCard from "../components/ClassCard";
import { Input } from "@repo/ui/input";
import { Search } from "lucide-react";

const Home = () => {
  return (
    <div className="container md:mt-12 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-2xl font-bold">Ongoing Classes</h1>
        <Link
          to="/create"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Create Class +
        </Link>
      </div>
      <section className="mt-6">
        <div className="flex items-center gap-1 ">
          <Input className="w-auto bg-muted " placeholder="Learning Mongoose" />
          <Button>
            <Search size={16} />
          </Button>
        </div>
        <div className="mt-3 grid md:grid-cols-3 lg:grid-cols-4 gap-3">
          <ClassCard />
          <ClassCard />
          <ClassCard />
        </div>
      </section>
    </div>
  );
};

export default Home;
