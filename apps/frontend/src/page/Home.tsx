import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Link } from "react-router-dom";
import ClassCard from "../components/ClassCard";
import { Input } from "@repo/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/constants";

const Home = () => {
  const [classes, setClasses] = useState<
    { name: string; description: string }[]
  >([]);
  const getClasses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/class`);
      setClasses(res.data.classes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getClasses();
  }, []);

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
          <Input
            className="w-auto bg-muted "
            disabled
            placeholder="Coming soon"
          />
          <Button>
            <Search size={16} />
          </Button>
        </div>
        <div className="mt-3 grid md:grid-cols-3 lg:grid-cols-4 gap-3">
          {classes.map((classItem, index) => (
            <ClassCard key={index} classData={classItem} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
