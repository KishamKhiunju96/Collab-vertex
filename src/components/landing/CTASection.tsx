"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function CTASection() {
  const stats = [
    {
      icon: TrendingUp,
      stat: "300%",
      label: "Average ROI Increase",
      gradient: "from-emerald-400 to-green-500",
      shadow: "shadow-emerald-500/25",
    },
    {
      icon: Users,
      stat: "100+",
      label: "Active Collaborations",
      gradient: "from-blue-400 to-cyan-500",
      shadow: "shadow-blue-500/25",
    },
    {
      icon: Star,
      stat: "4.9/5",
      label: "User Satisfaction",
      gradient: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-500/25",
    },
  ];

  const trustPoints = [
    { text: "No Credit Card Required", icon: CheckCircle },
    { text: "Cancel Anytime", icon: CheckCircle },
    { text: "24/7 Support", icon: CheckCircle },
  ];

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden isolate">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100" />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-300/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Content Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Promo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-full px-6 py-3 mb-10 shadow-2xl shadow-purple-500/30 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-white/95 font-semibold text-sm tracking-wide">
              Limited Time Offer — Free for First 3 Months
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 mb-8 leading-[1.1] tracking-tight"
          >
            Ready to Transform
            Your Collaborations?
            <span className="relative inline-block mt-2">
              {/* Underline Decoration */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300/60 via-pink-300/60 to-cyan-300/60 rounded-full origin-left"
              />
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-black max-w-3xl mx-auto mb-14 leading-relaxed font-light"
          >
            Join hundreds of brands and influencers creating authentic
            partnerships that drive real results.{" "}
            <span className="text-black font-medium">
              Start your journey today — it&apos;s free!
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14"
          >
            {/* Primary CTA */}
            <Link
              href="/register"
              className="group relative px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-500 hover:scale-[1.03] flex items-center gap-3 overflow-hidden border border-violet-400/20"
            >
              {/* Hover Gradient Background */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">
                Get Started Free
              </span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/login"
              className="group px-10 py-5 bg-white/90 backdrop-blur-2xl border-2 border-purple-200 text-purple-700 rounded-2xl font-bold text-lg hover:bg-white hover:border-purple-300 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-500 hover:scale-[1.03] flex items-center gap-3"
            >
              <span className="relative z-10">
                Already a Member?
              </span>
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative bg-white/70 backdrop-blur-2xl border border-purple-200/50 rounded-3xl p-8 text-center hover:bg-white/90 hover:border-purple-300/70 hover:shadow-2xl hover:shadow-purple-300/30 transition-all duration-500 cursor-default"
              >
                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 blur-xl`}
                />

                {/* Icon Container */}
                <div
                  className={`relative w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${item.gradient} p-[2px] group-hover:scale-110 transition-transform duration-500 ${item.shadow} shadow-lg`}
                >
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-purple-700" />
                  </div>
                </div>

                {/* Stat Number */}
                <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-2 tracking-tight">
                  {item.stat}
                </div>

                {/* Label */}
                <div className="text-gray-700 font-medium text-sm group-hover:text-gray-800 transition-colors duration-300">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Security Trust Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 bg-white/80 backdrop-blur-2xl border border-purple-200/60 rounded-2xl px-8 py-5 text-center shadow-lg"
        >
          <p className="text-gray-800 text-sm sm:text-base font-medium flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="text-lg ">🔒</span>
              <span>Your data is secure and encrypted</span>
            </span>
            <span className="hidden sm:inline ">•</span>
            <span>Trusted by industry leaders</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}