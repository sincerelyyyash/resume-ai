import { Upload, FileText, CheckCircle } from "lucide-react";
import { MotionDiv } from "./MotionDiv";

const steps = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Add your Data",
    description: "Start by Adding your data onto our platform. Keep it up-to-date for better results.",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Add Job Description",
    description: "Paste the job description you're applying for to get targeted optimization.",
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Get AI-Optimized Resume",
    description: "Receive a professionally optimized resume tailored to the job requirements.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-800/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-300">
            Get your perfect resume in just three simple steps
          </p>
        </MotionDiv>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-blue-500 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-300 max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 