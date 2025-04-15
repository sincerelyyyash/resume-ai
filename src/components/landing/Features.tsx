import { Sparkles, Zap, Shield, Brain } from "lucide-react";
import { MotionDiv } from "./MotionDiv";

const features = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI-Powered Optimization",
    description: "Our advanced AI analyzes job descriptions and optimizes your resume for maximum impact.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "ATS-Friendly Formatting",
    description: "Automatically format your resume to pass Applicant Tracking Systems with flying colors.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Privacy First",
    description: "Your data is encrypted and secure. We never share your information with third parties.",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Smart Suggestions",
    description: "Get intelligent recommendations to improve your resume based on industry standards.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Resume-AI?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-300">
            Everything you need to create the perfect resume
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {feature.description}
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}; 