"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  Users,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  CheckCircle,
  Zap,
  Globe,
} from "lucide-react";

const roles = [
  {
    type: "Brand",
    title: "For Brands",
    description:
      "Scale your marketing campaigns with authentic influencer partnerships",
    tagline: "Discover Perfect Influencers",
    icon: Briefcase,
    gradient: "from-purple-600 via-pink-600 to-red-600",
    bgGradient: "from-purple-50 to-pink-50",
    features: [
      { icon: Target, text: "Find verified influencers" },
      { icon: TrendingUp, text: "Track campaign ROI" },
      { icon: Users, text: "Manage collaborations" },
      { icon: Award, text: "Access premium creators" },
    ],
    stats: {
      number: "10+",
      label: "Active Influencers",
    },
    image: "🎯",
    link: "/register?role=brand",
  },
  {
    type: "Influencer",
    title: "For Influencers",
    description:
      "Monetize your influence and grow your brand through quality partnerships",
    tagline: "Find Perfect Brand Deals",
    icon: Sparkles,
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    bgGradient: "from-blue-50 to-cyan-50",
    features: [
      { icon: Globe, text: "Browse brand campaigns" },
      { icon: Zap, text: "Instant collaboration" },
      { icon: TrendingUp, text: "Grow your audience" },
      { icon: Award, text: "Secure payments" },
    ],
    stats: {
      number: "100+",
      label: "Active Brands",
    },
    image: "✨",
    link: "/register?role=influencer",
  },
];

export default function RolePreviewCards() {
  return (
    <section className="relative py-12 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-indigo-50/40 to-pink-50/40 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl" />
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
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              🎭 Choose Your Path
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="text-gray-800">
              Built for Everyone
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Whether you&apos;re a brand looking to scale or an influencer ready
            to monetize, we&apos;ve got you covered
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.type}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Card Container */}
                <div
                  className={`relative bg-gradient-to-br ${role.bgGradient} rounded-3xl p-1 shadow-2xl hover:shadow-3xl transition-all duration-500`}
                >
                  <div className="relative bg-white rounded-3xl p-8 md:p-10 h-full overflow-hidden">
                    {/* Header */}
                    <div className="relative z-10 mb-8">
                      {/* Icon Badge */}
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                      >
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                          <Icon className="w-8 h-8 text-gray-800" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}
                      >
                        {role.title}
                      </h3>

                      {/* Tagline */}
                      <p className="text-lg font-semibold text-gray-700 mb-3">
                        {role.tagline}
                      </p>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="relative z-10 mb-8 space-y-4">
                      {role.features.map((feature, idx) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.gradient} p-0.5 flex-shrink-0`}
                            >
                              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                                <FeatureIcon className="w-5 h-5 text-gray-700" />
                              </div>
                            </div>
                            <span className="text-gray-700 font-medium">
                              {feature.text}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    <div
                      className={`relative z-10 bg-gradient-to-br ${role.bgGradient} rounded-2xl p-6 mb-6 border-2 border-gray-100`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-3xl font-black bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent mb-1`}
                          >
                            {role.stats.number}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            {role.stats.label}
                          </div>
                        </div>
                        <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={role.link}
                      className={`relative z-10 flex items-center justify-center gap-2 w-full bg-gradient-to-r ${role.gradient} text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group/btn overflow-hidden`}
                    >
                      <span className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                      <span className="relative z-10">
                        Register as {role.type}
                      </span>
                      <Zap className="w-5 h-5 relative z-10" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}