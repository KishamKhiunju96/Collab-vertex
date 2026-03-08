"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Heart,
  Github,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const getStartedLinks = [
  { label: "Join as Brand", href: "/register?role=brand" },
  { label: "Join as Influencer", href: "/register?role=influencer" },
  { label: "Login", href: "/login" },
  { label: "Browse Campaigns", href: "/campaigns" },
  { label: "Success Stories", href: "/stories" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "GDPR", href: "/gdpr" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: Facebook,
    hoverColor: "hover:bg-blue-600 hover:border-blue-500",
    hoverShadow: "hover:shadow-blue-500/30",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: Instagram,
    hoverColor: "hover:bg-pink-600 hover:border-pink-500",
    hoverShadow: "hover:shadow-pink-500/30",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/",
    icon: Twitter,
    hoverColor: "hover:bg-sky-500 hover:border-sky-400",
    hoverShadow: "hover:shadow-sky-500/30",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/",
    icon: Linkedin,
    hoverColor: "hover:bg-blue-700 hover:border-blue-600",
    hoverShadow: "hover:shadow-blue-700/30",
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: Github,
    hoverColor: "hover:bg-gray-700 hover:border-gray-600",
    hoverShadow: "hover:shadow-gray-700/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950">
      {/* Top Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-b from-gray-950 via-slate-900 to-gray-900">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8"
          >
            {/* Brand Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 space-y-6"
            >
              {/* Logo */}
              <Link href="/" className="inline-block group">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:via-purple-300 group-hover:to-indigo-300 transition-all duration-500">
                    Collab
                  </span>
                  <span className="text-white/90">-</span>
                  <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:to-rose-300 transition-all duration-500">
                    Vertex
                  </span>
                </h2>
              </Link>

              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Connecting brands and influencers to create meaningful
                collaborations. Build authentic partnerships that drive real
                results and mutual growth.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="mailto:hello@collabvertex.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-violet-400 transition-colors duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm">kishamkhiunju96@gmail.com</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-gray-400 hover:text-violet-400 transition-colors duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">9761646055</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Bhaktapur, Nepal</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.hoverColor} ${social.hoverShadow}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 lg:col-start-6"
            >
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-300" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Get Started */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
                Get Started
              </h3>
              <ul className="space-y-3">
                {getStartedLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-300" />
                      <span>{link.label}</span>
                      {link.label === "Join as Brand" ||
                      link.label === "Join as Influencer" ? (
                        <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-300" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
                © {new Date().getFullYear()} Collab-Vertex. All rights
                reserved.
              </p>

              <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm order-1 sm:order-2">
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </motion.div>
                <span>by</span>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-violet-400 font-medium transition-colors duration-300"
                >
                  Collab-Vertex Team
                </a>
              </div>

              {/* Back to Top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="order-3 w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/20 group"
                aria-label="Back to top"
              >
                <ChevronRight className="w-4 h-4 -rotate-90 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}