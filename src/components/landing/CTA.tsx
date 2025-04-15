import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";

export const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Resume?
          </h2>
          <p className="text-xl text-zinc-300 dark:text-zinc-200 mb-8">
            Join thousands of professionals who have already optimized their resumes with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                // className="bg-black text-gray-200 hover:bg-gray-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {/* <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-900 dark:bg-black dark:text-white hover:bg-gray-400 hover:text-zinc-100"
              >
                Try Demo
              </Button>
            </Link> */}
          </div>
          <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-300">
            No credit card required • Cancel anytime
          </p>
        </MotionDiv>
      </div>
    </section>
  );
}; 