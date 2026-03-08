"use client";

import { motion, Variants } from "framer-motion";
import {
  Sparkles,
  Shield,
  BarChart3,
  MessageSquare,
  Users,
  Zap,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

type Feature = {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  badge?: string;
};

const features: Feature[] = [
  {
    title: "Smart Matching",
    desc: "AI-powered algorithms connect brands with perfect influencer matches based on audience, niche, and engagement.",
    icon: Sparkles,
    color: "text-purple-600",
    gradient: "from-purple-500 via-pink-500 to-red-500",
    badge: "AI-Powered",
  },
  {
    title: "Secure Payments",
    desc: "Transparent milestone-based payouts with escrow protection for both brands and influencers.",
    icon: Shield,
    color: "text-green-600",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    badge: "Protected",
  },
  {
    title: "Real-Time Analytics",
    desc: "Track campaign performance, engagement metrics, and ROI with comprehensive analytics dashboard.",
    icon: BarChart3,
    color: "text-blue-600",
    gradient: "from-blue-500 via-cyan-500 to-sky-500",
    badge: "Live Data",
  },
  {
    title: "In-App Collaboration",
    desc: "Seamless communication with built-in chat, file sharing, and project management tools.",
    icon: MessageSquare,
    color: "text-indigo-600",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    title: "Influencer Discovery",
    desc: "Advanced search filters to find influencers by niche, location, audience size, and engagement rate.",
    icon: Users,
    color: "text-orange-600",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    title: "Campaign Management",
    desc: "Plan, execute, and monitor multiple campaigns from a single unified dashboard.",
    icon: Target,
    color: "text-rose-600",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
  },
  {
    title: "Fast Onboarding",
    desc: "Get started in minutes with our intuitive setup process and helpful onboarding guides.",
    icon: Zap,
    color: "text-yellow-600",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    badge: "Quick Start",
  },
  {
    title: "Quality Assurance",
    desc: "Verified profiles, ratings, and reviews ensure you work with trusted partners every time.",
    icon: Award,
    color: "text-violet-600",
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    badge: "Verified",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function FeaturesGrid() {
  return (
    <section className="relative py-12 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-100/20 to-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-gray-800 font-extrabold">
              Everything You Need
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:border-gray-300/70">
                  {/* Animated Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 shadow-lg group-hover:shadow-2xl transition-shadow duration-500`}
                    >
                      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                        <Icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                    </motion.div>

                    {/* Floating Number Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.1,
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                    >
                      {index + 1}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm mb-4">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}