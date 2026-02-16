"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on escape key and handle body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contacts", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-md"
            : "bg-white/80 backdrop-blur-md shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-50 flex items-center gap-2 group"
              onClick={handleLinkClick}
            >
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary bg-clip-text text-transparent bg-200% animate-gradient-shift">
                  Collab-Vertex
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm lg:text-base font-medium transition-colors duration-300 group ${
                    pathname === link.href
                      ? "text-brand-primary"
                      : "text-text-secondary hover:text-brand-primary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300 ${
                      pathname === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}

              <Link
                href="/login"
                className="ml-2 bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-accent hover:to-brand-primary text-white px-5 lg:px-6 py-2 lg:py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Login
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 md:hidden p-2 rounded-lg hover:bg-brand-primary/10 transition-all duration-300 active:scale-95"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                  }`}
                >
                  <Menu className="w-6 h-6 text-brand-primary" />
                </span>
                <span
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
                  }`}
                >
                  <X className="w-6 h-6 text-brand-accent" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="h-16 sm:h-20" />

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm z-40 md:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-white shadow-2xl overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="sticky top-0 bg-gradient-to-br from-brand-primary/5 via-brand-accent/5 to-brand-secondary/5 backdrop-blur-md border-b border-border-subtle px-6 py-5 sm:py-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Menu
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-brand-primary" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="px-4 py-6 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`group relative flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 text-brand-primary shadow-sm"
                    : "text-text-primary hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-brand-accent/5 hover:text-brand-primary"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Icon/Indicator */}
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    pathname === link.href
                      ? "bg-brand-primary scale-100"
                      : "bg-text-muted scale-0 group-hover:scale-100 group-hover:bg-brand-accent"
                  }`}
                />

                {/* Link Text */}
                <span className="flex-1 text-base">{link.label}</span>

                {/* Arrow */}
                <svg
                  className={`w-5 h-5 transition-all duration-300 ${
                    pathname === link.href
                      ? "text-brand-primary translate-x-0 opacity-100"
                      : "text-text-muted -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-brand-accent"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </nav>

          {/* Mobile Action Section */}
          <div className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-white via-white to-transparent border-t border-border-subtle">
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-accent hover:to-brand-primary text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-accent/40 active:scale-98"
            >
              <span>Get Started</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            {/* Additional Info */}
            <p className="mt-4 text-center text-xs text-text-muted">
              New to Collab-Vertex?{" "}
              <Link
                href="/select-role"
                onClick={handleLinkClick}
                className="text-brand-primary hover:text-brand-accent font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
