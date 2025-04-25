import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import Appbar from "@/components/Appbar";
import { Play } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";

const play = Play({
  subsets: ["latin"],
  variable: "--font-play",
  weight: ["400", "700"]
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
      <body className={`antialiased dark:bg-zinc-900 ${play.className}`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="flex-none w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* <Appbar /> */}
            </header>
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 dark:bg-zinc-900">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

