import { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";

export const metadata: Metadata = {
  title: 'Resume AI - AI-Powered Resume Builder',
  description: 'Create professional resumes with AI assistance. Get personalized suggestions and optimize your resume for better job opportunities.',
  keywords: 'resume builder, AI resume, professional resume, job application, career tools',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Resume Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="border-b-2 border-zinc-200 dark:border-zinc-700 pb-8">
          <Hero />
        </div>

        {/* Resume Sections */}
        <div className="space-y-8 py-8">
          {/* Summary Section */}
          <section className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-200">Professional Summary</h2>
            <Features />
          </section>

          {/* Experience Section */}
          <section className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-200">How It Works</h2>
            <HowItWorks />
          </section>

          {/* Testimonials Section */}
          <section className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-200">References</h2>
            <Testimonials />
          </section>

          {/* Contact Section */}
          {/* <section>
            <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-200">Touch</h2>
            <CTA />
          </section> */}
        </div>
      </div>
    </main>
  );
}
