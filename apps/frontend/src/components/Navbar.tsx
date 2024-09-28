import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { MessageSquare } from "lucide-react";
import { BACKEND_URL } from "../config/constants";
import { useSession } from "../hooks/UseSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

const Navbar = () => {
  const { session } = useSession();

  return (
    <div className=" border-b">
      <div className=" container py-3 flex items-center">
        <a className="flex items-center justify-center" href="/">
          <MessageSquare className="h-6 w-6 mr-2" />
          <span className="font-bold">RealTime Q&A</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {!session.loading && !session.authenticated ? (
            <>
              <a
                className={cn(buttonVariants({ variant: "outline" }))}
                href={`${BACKEND_URL}/api/v1/auth/google`}
              >
                Login
              </a>
              <a className={cn(buttonVariants({}))} href="#">
                Signup
              </a>
            </>
          ) : null}

          {!session.loading && session.authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="border-0 outline-none">
                <div>
                  <img
                    className="rounded-full w-8"
                    src={session.user.avatar}
                    alt=""
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <a
                    className="text-red-500 hover:text-red-600 "
                    href={`${BACKEND_URL}/api/v1/auth/logout`}
                  >
                    Logout
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
