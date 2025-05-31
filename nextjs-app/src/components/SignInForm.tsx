"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
}

export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Login Successful",
      description: "Checking your profile status...",
    });

    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const userId = sessionData?.user?.id;

      if (!userId) {
        toast({
          title: "Session Error",
          description: "Could not retrieve account details.",
          variant: "destructive",
        });
        return;
      }

      const { data: profileResponse } = await axios.get("/api/user/profile-completion-status");
      console.log("Profile completion response:", profileResponse);
      
      if (!profileResponse?.success) {
        toast({
          title: "Profile Status Error",
          description: "Could not check profile completion status.",
          variant: "destructive",
        });
        return;
      }

      const completionPercentage = profileResponse.data.completionPercentage || 0;
      const hasMinimumRequiredFields = profileResponse.data.hasMinimumRequiredFields || false;
      
      console.log("Completion percentage:", completionPercentage);
      console.log("Has minimum required fields:", hasMinimumRequiredFields);

      if (!hasMinimumRequiredFields) {
        toast({
          title: "Incomplete Profile",
          description: "Please complete your basic profile information and add at least one skill to proceed.",
        });
        router.push("/user/profile");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Profile status check error:", err);
      toast({
        title: "Error",
        description: "An error occurred while checking profile status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-900">
      {/* <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4 mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="********"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-500 m-2">{error}</p>}

        <Button
          className="bg-gradient-to-br relative group/btn from-black dark:from-white dark:to-white to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] dark:text-black"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form> */}

      {/* <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">
            or
          </span>
        </div>
      </div> */}

<div className="flex flex-col items-center space-y-3 mt-4">
  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
    Use your social account to sign in
  </p>
  <Button
    className="w-full bg-white border border-gray-300 hover:bg-gray-200 text-gray-700 rounded-md h-10 font-medium flex items-center justify-center gap-2"
    onClick={() => signIn("google", { callbackUrl: "/" })}
  >
    <FcGoogle size={20} /> Sign in with Google
  </Button>
  <Button
    className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-md h-10 font-medium flex items-center justify-center gap-2"
    onClick={() => signIn("github", { callbackUrl: "/" })}
  >
    <FaGithub size={20} /> Sign in with GitHub
  </Button>
</div>


      {/* <div className="flex justify-center mt-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign Up
          </button>{" "}
          here
        </p>
      </div> */}
    </div>
  );
}

