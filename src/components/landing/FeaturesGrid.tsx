"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Shield,
  BarChart3,
  MessageSquare,
  Users,
  Zap,
  Target,
  Award,
} from "lucide-react";

type Feature = {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
};

const features: Feature[] = [
  {
    title: "Smart Matching",
    desc: "AI-powered algorithms connect brands with perfect influencer matches based on audience, niche, and engagement.",
    icon: Sparkles,
    color: "text-purple-400",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Secure Payments",
    desc: "Transparent milestone-based payouts with escrow protection for both brands and influencers.",
    icon: Shield,
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Real-Time Analytics",
    desc: "Track campaign performance, engagement metrics, and ROI with comprehensive analytics dashboard.",
    icon: BarChart3,
    color: "text-green-400",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "In-App Collaboration",
    desc: "Seamless communication with built-in chat, file sharing, and project management tools.",
    icon: MessageSquare,
    color: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Influencer Discovery",
    desc: "Advanced search filters to find influencers by niche, location, audience size, and engagement rate.",
    icon: Users,
    color: "text-indigo-400",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Campaign Management",
    desc: "Plan, execute, and monitor multiple campaigns from a single unified dashboard.",
    icon: Target,
    color: "text-pink-400",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Fast Onboarding",
    desc: "Get started in minutes with our intuitive setup process and helpful onboarding guides.",
    icon: Zap,
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Quality Assurance",
    desc: "Verified profiles, ratings, and reviews ensure you work with trusted partners every time.",
    icon: Award,
    color: "text-teal-400",
    gradient: "from-teal-500 to-cyan-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function FeaturesGrid() {
  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />

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
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ✨ Powerful Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools and features designed to make influencer
            collaboration effortless and effective
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Hover Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                        <Icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                    </div>

                    {/* Floating Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Decorative Corner */}
                  <div
                    className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-tl-full transition-opacity duration-500`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Join hundreds of brands and influencers already collaborating
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-gray-700 font-medium">+100 active users</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
