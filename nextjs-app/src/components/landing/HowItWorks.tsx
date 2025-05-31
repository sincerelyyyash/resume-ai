import { Upload, FileText, CheckCircle } from "lucide-react";
import { MotionDiv } from "./MotionDiv";

const steps = [
  {
    icon: <Upload className="w-5 h-5" />,
    title: "Add Your Resume Data",
    description: "Start by adding your current resume and personal details. Keep your profile updated for the best AI-driven results.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Input Job Description",
    description: "Paste the job description you’re targeting, so our AI can tailor your resume for maximum relevance.",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Get a Tailored Resume",
    description: "Receive a professionally enhanced, job-specific resume optimized to land more interviews.",
  },
  
];

export const HowItWorks = () => {
  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <MotionDiv
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="flex items-start space-x-4"
        >
          <div className="flex-shrink-0 mt-1">
            {step.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
                {step.title}
              </h3>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Step {index + 1}
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              {step.description}
            </p>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
}; 