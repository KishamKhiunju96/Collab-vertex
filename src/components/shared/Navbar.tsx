// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background-light/60 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-black hover:text-red-400 transition"
          >
            Collab-Vertex
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-gray-800 font-medium hover:text-red-400 transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-800 font-medium hover:text-red-400 transition"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-800 font-medium hover:text-red-400 transition"
            >
              Services
            </Link>
            <Link
              href="/contacts"
              className="text-gray-800 font-medium hover:text-red-400 transition"
            >
              Contact
            </Link>

            <Link
              href="/login"
              className="ml-4 bg-red-300 text-red-950 px-6 py-2 rounded-lg font-medium hover:bg-red-500 transition shadow"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
