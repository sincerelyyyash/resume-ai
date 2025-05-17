import { Sparkles, Zap, Shield, Brain } from "lucide-react";
import { MotionDiv } from "./MotionDiv";

const features = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI-Powered Personalization",
    description: "Our AI analyzes each job description and customizes your resume to highlight the most relevant skills and achievements.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "ATS-Optimized Resumes",
    description: "We ensure your resumes are formatted to easily pass through Applicant Tracking Systems, maximizing your interview chances.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Secure and Private",
    description: "Your resume data stays private. We never share your personal information.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Smart Resume Insights",
    description: "Receive actionable AI suggestions to refine and strengthen your resume based on the latest hiring trends and best practices.",
  },
  
];

export const Features = () => {
  return (
    <div className="space-y-6">
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
      Resume-AI is a platform that uses artificial intelligence to craft tailored resumes for every job opportunity. By aligning your experience with each job description, we help you stand out and maximize your chances in today's competitive job market.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start space-x-4"
          >
            <div className="flex-shrink-0 mt-1">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}; 