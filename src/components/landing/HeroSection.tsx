"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/Brand.jpg"
          alt="CollabVertex Hero Background"
          fill
          priority
          className="object-cover opacity-20 mix-blend-overlay"
        />
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-button-primary-DEFAULT/20 via-brand-accent-DEFAULT/10 to-brand-secondary-DEFAULT/20" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-button-primary-DEFAULT/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary-DEFAULT/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent-DEFAULT/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 shadow-2xl">
              <span className="text-white font-medium">
                #1 Influencer Collaboration Platform
              </span>
              <div className="w-2 h-2 bg-brand-secondary-DEFAULT rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-brand-primary-200 to-brand-secondary-light bg-clip-text text-transparent drop-shadow-2xl">
              Connect, Create,
            </span>
            <br />
            <span className="bg-gradient-to-r from-brand-secondary-light via-brand-primary-200 to-brand-accent-light bg-clip-text text-transparent drop-shadow-2xl">
              Collaborate
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl max-w-4xl mx-auto mb-12 text-white/90 leading-relaxed font-light"
          >
            The ultimate platform bridging{" "}
            <span className="font-semibold text-brand-accent-light">brands</span> and{" "}
            <span className="font-semibold text-brand-secondary-light">influencers</span>.
            Discover authentic collaborations that amplify your reach.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/select-role"
              className="group relative px-8 py-4 bg-gradient-to-r from-button-primary-DEFAULT to-brand-accent-DEFAULT text-white rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-accent transition-all duration-300 hover:scale-105 flex items-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-button-primary-hover to-brand-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="group px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span>Sign In</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                10+
              </div>
              <div className="text-sm md:text-base text-white/70">
                Active Users
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                2+
              </div>
              <div className="text-sm md:text-base text-white/70">
                Successful Collabs
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-1">
                99%
              </div>
              <div className="text-sm md:text-base text-white/70">
                Satisfaction
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
