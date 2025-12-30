// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background-light/60 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-black hover:text-red-400 transition"
            >
              Collab-Vertex
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-800 hover:text-red-400 font-medium transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-800 hover:text-red-400 font-medium transition"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-800 hover:text-red-400 font-medium transition"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-gray-800 hover:text-red-400 font-medium transition"
            >
              Contact
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="bg-red-300 text-red-950 px-6 py-2 rounded-lg font-medium hover:bg-red-500 transition shadow"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
