import { Sparkles, Zap, Shield, Brain } from "lucide-react";
import { MotionDiv } from "./MotionDiv";

const features = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI-Powered Optimization",
    description: "Our advanced AI analyzes job descriptions and optimizes your resume for maximum impact.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "ATS-Friendly Formatting",
    description: "Automatically format your resume to pass Applicant Tracking Systems with flying colors.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Privacy First",
    description: "Your data is encrypted and secure. We never share your information with third parties.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Smart Suggestions",
    description: "Get intelligent recommendations to improve your resume based on industry standards.",
  },
];

export const Features = () => {
  return (
    <div className="space-y-6">
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Resume-AI is a cutting-edge platform that leverages artificial intelligence to transform your resume into a powerful career tool. Our platform combines advanced algorithms with industry best practices to help you stand out in today's competitive job market.
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