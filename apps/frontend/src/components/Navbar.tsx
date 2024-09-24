import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { MessageSquare } from "lucide-react";

const Navbar = () => {
  return (
    <div className=" border-b">
      <div className=" container py-3 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <MessageSquare className="h-6 w-6 mr-2" />
          <span className="font-bold">RealTime Q&A</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className={cn(buttonVariants({ variant: "outline" }))} href="#">
            Login
          </a>
          <a className={cn(buttonVariants({}))} href="#">
            Signup
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
