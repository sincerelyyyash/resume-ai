import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "./MotionDiv";

export const CTA = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
              Contact Information
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Email: contact@resume-ai.com
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Website: www.resume-ai.com
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
              Availability
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Monday - Friday: 9:00 AM - 6:00 PM EST
            </p>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-start space-y-4"
        >
          <Link href="/signup">
            <Button>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No credit card required • Cancel anytime
          </p>
        </MotionDiv>
      </div>
    </div>
  );
}; 