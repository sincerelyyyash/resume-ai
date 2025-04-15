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
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join thousands of professionals who have transformed their careers
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-zinc-800/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 p-6 rounded-xl"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4">
                  {/* Image would go here */}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}; 