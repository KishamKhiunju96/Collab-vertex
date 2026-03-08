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
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden isolate">
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-800" />

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.5)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_center,rgba(168,85,247,0.3)_0%,transparent_70%)]" />

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 25, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, 35, 0],
            x: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-20 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/5 rounded-full blur-[100px]"
        />

        {/* Floating Decorative Icons */}
        <motion.div
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-[15%] hidden lg:block"
        >
          <Sparkles className="w-14 h-14 text-white/10" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 left-[10%] hidden lg:block"
        >
          <Zap className="w-12 h-12 text-white/10" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[5%] hidden xl:block"
        >
          <Star className="w-10 h-10 text-white/[0.07]" />
        </motion.div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
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
            className="inline-flex items-center gap-3 bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] rounded-full px-6 py-3 mb-10 shadow-2xl shadow-purple-900/20"
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
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight"
          >
            Ready to Transform
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-amber-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                Your Collaborations?
              </span>
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
            className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-14 leading-relaxed font-light"
          >
            Join hundreds of brands and influencers creating authentic
            partnerships that drive real results.{" "}
            <span className="text-white font-medium">
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
              className="group relative px-10 py-5 bg-white rounded-2xl font-bold text-lg shadow-2xl shadow-black/20 hover:shadow-white/25 transition-all duration-500 hover:scale-[1.03] flex items-center gap-3 overflow-hidden"
            >
              {/* Hover Gradient Background */}
              <span className="absolute inset-0 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
                Get Started Free
              </span>
              <ArrowRight className="w-5 h-5 relative z-10 text-violet-700 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/login"
              className="group px-10 py-5 bg-white/[0.08] backdrop-blur-2xl border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/[0.15] hover:border-white/30 transition-all duration-500 hover:scale-[1.03] flex items-center gap-3"
            >
              <span>Already a Member?</span>
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
          >
            {trustPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-2.5 text-white/80"
                >
                  <Icon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    {point.text}
                  </span>
                </motion.div>
              );
            })}
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
                className="group relative bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-8 text-center hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-500 cursor-default"
              >
                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 blur-xl`}
                />

                {/* Icon Container */}
                <div
                  className={`relative w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${item.gradient} p-[2px] group-hover:scale-110 transition-transform duration-500 ${item.shadow} shadow-lg`}
                >
                  <div className="w-full h-full bg-gray-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Stat Number */}
                <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">
                  {item.stat}
                </div>

                {/* Label */}
                <div className="text-white/60 font-medium text-sm group-hover:text-white/80 transition-colors duration-300">
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
          className="mt-10 bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] rounded-2xl px-8 py-5 text-center"
        >
          <p className="text-white/60 text-sm sm:text-base font-medium flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>Your data is secure and encrypted</span>
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>Trusted by industry leaders</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}