"use client"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import React from 'react';
import { PostHogProvider } from "./PostHogProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};