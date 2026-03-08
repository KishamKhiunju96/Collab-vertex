"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Handshake,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Create Your Profile",
    description:
      "Sign up as a Brand or Influencer in seconds. Complete your profile with your niche, audience, and collaboration preferences.",
    icon: UserPlus,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    number: 2,
    title: "Discover & Connect",
    description:
      "Browse through verified profiles, use smart filters to find perfect matches, or post your campaign and let influencers come to you.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    number: 3,
    title: "Collaborate & Create",
    description:
      "Communicate in-app, agree on deliverables, set milestones, and bring your campaign to life with secure agreements.",
    icon: Handshake,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100",
  },
  {
    number: 4,
    title: "Track & Grow",
    description:
      "Monitor campaign performance with real-time analytics, receive secure payments, and build lasting partnerships.",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    iconBg: "bg-orange-100",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-purple-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/20 to-blue-100/20 rounded-full blur-3xl" />
      </div>

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20" />
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
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CheckCircle className="w-4 h-4" />
              Simple 4-Step Process
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="text-gray-800 font-extrabold">
              How It Works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started in minutes and launch your first collaboration campaign
            today — no complex setup required
          </p>
        </motion.div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block relative">
          {/* Animated Connecting Line */}
          <div className="absolute top-24 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-300 via-blue-300 to-orange-300 opacity-40" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500 origin-left"
            />
          </div>

          {/* Progress Dots */}
          <div className="absolute top-[92px] left-0 right-0 flex justify-between px-[10%]">
            {steps.map((step, index) => (
              <motion.div
                key={`dot-${index}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.2 }}
                className={`w-3 h-3 rounded-full bg-gradient-to-br ${step.color} shadow-md`}
              />
            ))}
          </div>

          <div className="grid grid-cols-4 gap-8 mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative group"
                >
                  {/* Number Badge */}
                  <div className="flex justify-center mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <div
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg hover:shadow-2xl transition-shadow duration-300 z-10 relative`}
                      >
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <span
                            className={`text-3xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}
                          >
                            {step.number}
                          </span>
                        </div>
                      </div>
                      {/* Glow Effect */}
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}
                      />
                    </motion.div>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`${step.bgColor} rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl group/card relative overflow-hidden h-full`}
                  >
                    {/* Card Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover/card:opacity-5 transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} p-0.5 mb-5 shadow-md`}
                      >
                        <div className={`w-full h-full ${step.iconBg} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-7 h-7 text-gray-700" />
                        </div>
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover/card:text-gray-950 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {step.description}
                      </p>

                      {/* Arrow Indicator */}
                      {index < steps.length - 1 && (
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:block">
                          <ArrowRight className="w-6 h-6 text-gray-300 group-hover/card:text-gray-400 transition-colors" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet Timeline View */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative flex gap-6"
              >
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-10 top-24 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-blue-300 to-orange-300 opacity-50">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      className={`w-full h-full bg-gradient-to-b ${step.color} origin-top`}
                    />
                  </div>
                )}

                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg relative z-10`}
                    >
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <span
                          className={`text-2xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}
                        >
                          {step.number}
                        </span>
                      </div>
                    </div>
                    {/* Pulse Effect */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-lg animate-pulse`}
                    />
                  </motion.div>
                </div>

                {/* Content Card */}
                <div className="flex-1 pb-4">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`${step.bgColor} rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl relative overflow-hidden group/card`}
                  >
                    {/* Card Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover/card:opacity-5 transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} p-0.5 mb-4 shadow-md`}
                      >
                        <div className={`w-full h-full ${step.iconBg} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                      </motion.div>

                      {/* Text */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover/card:text-gray-950 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {step.description}
                      </p>

                      {/* Step Indicator */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400">
                          Step {step.number} of {steps.length}
                        </span>
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${step.color}`}
                            style={{ width: `${(step.number / steps.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}