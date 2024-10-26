import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import Appbar from "@/components/Appbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Resume-AI",
  description: "AI-Powered Tailor-Made Resumes Based on Job Descriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-zinc-900`}
      >
        <Providers>
          <header className="flex-none w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Appbar />
          </header>
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 dark:bg-zinc-900 h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
