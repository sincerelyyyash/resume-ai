"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { User, LogOut, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  const handleSignOut = async () => {
    try {
      toast({
        title: "Logging out...",
        description: "You will be redirected to the sign in page.",
      });
      
      // Add a small delay before signing out
      await new Promise(resolve => setTimeout(resolve, 1000));
      await signOut({ callbackUrl: '/signin' });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            <DropdownMenuItem onClick={() => router.push("/feedback")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback & Support
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
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

