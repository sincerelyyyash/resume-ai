
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast"

interface FormData {
  name: string;
  email: string;
  password: string;
}

export function SignupForm() {
  const { toast } = useToast()
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMatchError(formData.password !== value ? "Passwords do not match" : null);
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");

      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });

      return;
    }

    setPasswordMatchError(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : "Signup failed";

        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        });

        throw new Error(errorMessage);
      }

      toast({
        title: "Account Created",
        description: "You have successfully signed up!",
      });

      router.push("/");
    } catch (err) {
      const errorMsg = (err as Error).message;
      setError(errorMsg);

      toast({
        title: "Something went wrong",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-zinc-900">
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4 mb-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />

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

          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            placeholder="********"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>

        {passwordMatchError && <p className="text-red-500 m-2">{passwordMatchError}</p>}
        {error && <p className="text-red-500 m-2">{error}</p>}

        <Button
          className="bg-gradient-to-br relative group/btn from-black dark:from-white dark:to-white to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] dark:text-black"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500">
            or
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-3 mt-4">
        <Button
          className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md h-10 font-medium flex items-center justify-center gap-2"
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

      <div className="flex justify-center mt-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/signin")}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign In
          </button> here
        </p>
      </div>
    </div>
  );
}

