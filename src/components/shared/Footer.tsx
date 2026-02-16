// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <div className="relative border-t border-border-subtle">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-40" />

      <footer className="bg-gradient-to-b from-background-hero via-white to-background-alternate text-text-secondary py-8 sm:py-10 lg:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent animate-gradient-shift bg-200%">
                Collab-Vertex
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-text-muted max-w-xs">
                Connecting brands and influencers to create meaningful
                collaborations and drive success together.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4 relative pb-2">
                Quick Links
                <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full" />
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm sm:text-base text-text-secondary hover:text-brand-accent transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs sm:text-base">
                      →
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Home
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm sm:text-base text-text-secondary hover:text-brand-accent transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs sm:text-base">
                      →
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      About Us
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-sm sm:text-base text-text-secondary hover:text-brand-accent transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs sm:text-base">
                      →
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Services
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm sm:text-base text-text-secondary hover:text-brand-accent transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs sm:text-base">
                      →
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Contact
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Started */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4 relative pb-2">
                Get Started
                <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full" />
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/select-role"
                    className="text-sm sm:text-base text-text-secondary hover:text-brand-accent transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs sm:text-base">
                      →
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Join as Brand
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/select-role"
                    className="text-sm sm:text-base text-text-secondary hover:text-brand-accent transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs sm:text-base">
                      →
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Join as Influencer
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-sm sm:text-base text-text-primary font-medium underline hover:text-brand-accent hover:no-underline transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-xs sm:text-base">
                      →
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Login
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4 relative pb-2">
                Connect With Us
                <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full" />
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl rounded-lg bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 hover:from-brand-primary/10 hover:to-brand-accent/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/20 active:scale-95"
                  aria-label="Facebook"
                >
                  📘
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl rounded-lg bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 hover:from-brand-primary/10 hover:to-brand-accent/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/20 active:scale-95"
                  aria-label="Instagram"
                >
                  📸
                </a>
                <a
                  href="https://github.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl rounded-lg bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 hover:from-brand-primary/10 hover:to-brand-accent/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-secondary/20 active:scale-95"
                  aria-label="GitHub"
                >
                  🐙
                </a>
              </div>
              <div className="text-xs sm:text-sm text-text-muted">
                <p className="mb-1">Email:</p>
                <a
                  href="mailto:kishamkhiunju96@gmail.com"
                  className="text-brand-primary font-medium hover:text-brand-accent transition-colors duration-300 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-full break-all"
                >
                  kishamkhiunju96@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-border-subtle/50 mt-8 sm:mt-10 lg:mt-12 pt-5 sm:pt-6 text-center">
            <p className="text-xs sm:text-sm text-text-muted mb-2 sm:mb-3">
              © {new Date().getFullYear()} Collab-Vertex. All rights reserved.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4">
              <Link
                href="/privacy"
                className="text-xs sm:text-sm text-text-secondary hover:text-brand-accent transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                Privacy Policy
              </Link>
              <span className="text-text-muted text-xs sm:text-sm">•</span>
              <Link
                href="/terms"
                className="text-xs sm:text-sm text-text-secondary hover:text-brand-accent transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
