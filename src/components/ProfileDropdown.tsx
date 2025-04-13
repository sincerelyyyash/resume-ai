
"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user?.email || "";
  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col items-center">
            <DropdownMenuItem onClick={() => router.push("/")}>
              Home
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/profile")}>
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => router.push("/settings")}> */}
            {/*   Settings */}
            {/* </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => router.push("/signin")}
          className="px-4 py-2 text-white bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded hover:bg-gray-800 transition"
        >
          Sign In
        </Button>
      )}
    </div>
  );
}

