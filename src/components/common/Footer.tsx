// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <div className="border-t border-gray-800  text-center text-sm">
      <footer className="bg-background-light text-text-primary-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Collab-Vertex</h2>
              <p className="text-sm leading-relaxed">
                Connecting brands and influencers to create powerful collaborations that drive growth and engagement.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-red-400 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-red-400 transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-red-400 transition">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-red-400 transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Get Started</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/select-role" className="hover:text-red-400 transition">
                    Join as Brand
                  </Link>
                </li>
                <li>
                  <Link href="/select-role" className="hover:text-red-400 transition">
                    Join as Influencer
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-black  underline hover:text-red-400">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="hover:text-red-400 transition text-2xl"></a>
                <a href="#" className="hover:text-red-400 transition text-2xl"></a>
                <a href="#" className="hover:text-red-400 transition text-2xl"></a>
                <a href="#" className="hover:text-red-400 transition text-2xl"></a>
              </div>
              <p className="text-sm">
                Email: <a href="" className=""></a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
            <div className="mt-2">
              <Link href="/privacy" className="hover:text-red-400 mx-2">Privacy Policy</Link>
              <span className="text-text-primary">|</span>
              <Link href="/terms" className="hover:text-red-400 mx-2">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
