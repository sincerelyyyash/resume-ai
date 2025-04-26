import { Star } from "lucide-react";
import { MotionDiv } from "./MotionDiv";

const testimonials = [
  {
    quote: "Resume-AI helped me land my dream job at Google. The AI optimization was spot on!",
    author: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: "/testimonials/sarah.jpg",
  },
  {
    quote: "I was struggling with my resume for months. Resume-AI transformed it in minutes and I got multiple interview calls!",
    author: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    image: "/testimonials/michael.jpg",
  },
  {
    quote: "The ATS optimization feature is a game-changer. My resume now gets past the screening process every time.",
    author: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Amazon",
    image: "/testimonials/emily.jpg",
  },
];

export const Testimonials = () => {
  return (
    <div className="space-y-8">
      {testimonials.map((testimonial, index) => (
        <MotionDiv
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="border-l-4 border-zinc-200 dark:border-zinc-700 pl-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
                {testimonial.author}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {testimonial.role} at {testimonial.company}
              </p>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-zinc-200 fill-current"
                />
              ))}
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 italic">
            "{testimonial.quote}"
          </p>
        </MotionDiv>
      ))}
    </div>
  );
}; 