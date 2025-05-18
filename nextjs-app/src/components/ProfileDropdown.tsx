"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UserMenu() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  return (
    <div className="flex items-center space-x-4 z-50">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col items-center">
            {/* <DropdownMenuItem onClick={() => router.push("/")}>
              Home
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/profile")}>
              Profile
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem onClick={() => router.push("/settings")}> */}
            {/*   Settings */}
            {/* </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <></>
      )}
    </div>
  );
}

