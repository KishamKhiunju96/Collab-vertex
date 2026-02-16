"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechStyle Co.",
    image: "👩‍💼",
    rating: 5,
    text: "This platform completely transformed how we connect with influencers. The AI matching is incredibly accurate, and we've seen a 300% increase in campaign ROI!",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Mike Chen",
    role: "Content Creator",
    company: "@MikeTravels",
    image: "👨‍💻",
    rating: 5,
    text: "As an influencer, finding quality brand partnerships used to be a nightmare. Collab Vertex made it seamless. I've doubled my income in just 3 months!",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Emma Williams",
    role: "CEO",
    company: "BeautyBrand Inc.",
    image: "👩‍🦰",
    rating: 5,
    text: "The analytics dashboard alone is worth it. We can track every metric in real-time and optimize our campaigns on the fly. Absolutely game-changing!",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "David Martinez",
    role: "Lifestyle Influencer",
    company: "@DavidDaily",
    image: "👨",
    rating: 5,
    text: "The secure payment system and milestone tracking give me peace of mind. No more chasing brands for payments. Everything is transparent and professional.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "Lisa Anderson",
    role: "Brand Manager",
    company: "Fashion Forward",
    image: "👱‍♀️",
    rating: 5,
    text: "We've worked with dozens of influencers through this platform. The collaboration tools and in-app chat make managing campaigns so much easier!",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    name: "James Wilson",
    role: "Tech Reviewer",
    company: "@TechWithJames",
    image: "👨‍🔬",
    rating: 5,
    text: "Best platform for creator-brand partnerships, hands down. The verification system ensures I only work with legitimate brands. Highly recommend!",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export default function TestimonialsCarousel() {
  // Auto-rotation state (currently not used but available for future carousel implementation)
  // const [activeIndex, setActiveIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ⭐ Trusted by Thousands
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            What Our Users Say
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Join thousands of satisfied brands and influencers who trust Collab
            Vertex
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 h-full">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6 relative z-10">
                  {/* Avatar */}
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.gradient} p-0.5 flex-shrink-0`}
                  >
                    <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center text-3xl">
                      {testimonial.image}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-white/70 mb-1">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-white/50">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-white/90 leading-relaxed relative z-10">
                  &quot;{testimonial.text}&quot;
                </p>

                {/* Gradient Accent */}
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${testimonial.gradient} rounded-b-2xl opacity-50 group-hover:opacity-100 transition-opacity`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { number: "100+", label: "Happy Users" },
            { number: "50+", label: "Collaborations" },
            { number: "99%", label: "Success Rate" },
            { number: "4.9/5", label: "Avg Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Social Proof Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4">
            <div className="text-white">
              <p className="font-semibold">
                Join 100+ users transforming their collaborations
              </p>
              <p className="text-sm text-white/70">
                Trusted by leading brands and influencers worldwide
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
