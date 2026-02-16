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
  },
  {
    number: 2,
    title: "Discover & Connect",
    description:
      "Browse through verified profiles, use smart filters to find perfect matches, or post your campaign and let influencers come to you.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
  },
  {
    number: 3,
    title: "Collaborate & Create",
    description:
      "Communicate in-app, agree on deliverables, set milestones, and bring your campaign to life with secure agreements.",
    icon: Handshake,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
  },
  {
    number: 4,
    title: "Track & Grow",
    description:
      "Monitor campaign performance with real-time analytics, receive secure payments, and build lasting partnerships.",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              🚀 Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes and launch your first collaboration campaign
            today
          </p>
        </motion.div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block relative">
          {/* Connecting Line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-orange-200" />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Number Badge */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg z-10 relative`}
                      >
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <span className="text-3xl font-black bg-gradient-to-br bg-clip-text text-transparent from-gray-700 to-gray-900">
                            {step.number}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`${step.bgColor} rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl group`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-gray-700" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet Timeline View */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative flex gap-6"
              >
                {/* Timeline Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-0 w-1 bg-gradient-to-b from-purple-200 to-blue-200" />
                )}

                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg relative z-10`}
                  >
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl font-black bg-gradient-to-br bg-clip-text text-transparent from-gray-700 to-gray-900">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  <div
                    className={`${step.bgColor} rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} p-0.5 mb-4`}
                    >
                      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>

                    {/* Text */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful collaborations happening right now on
              Collab Vertex
            </p>
            <a
              href="/select-role"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
