"use client";

import Navbar from "@/components/shared/Navbar";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <><Navbar /><main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 text-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We are here to help and would love to hear from you. Whether you
            have a question about our services, need a custom quote, want to
            discuss a potential project, or simply want to share feedback, our
            team is ready to respond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-lg bg-gray-50 border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abc@gmail.com"
                  required
                  className="w-full rounded-lg bg-gray-50 border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows={5}
                  required
                  className="w-full rounded-lg bg-gray-50 border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 font-semibold shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">kishamkhiunju96@gmail.com</p>
                    <p className="text-gray-600">dixamshrestha@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Location
                    </h3>
                    <p className="text-gray-600">
                      Bhaktapur
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Follow Us
              </h2>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition"
                  aria-label="Twitter"
                >
                  <span className="text-2xl">🐦</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition"
                  aria-label="LinkedIn"
                >
                  <span className="text-2xl">💼</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <span className="text-2xl">📷</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <span className="text-2xl">📘</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main></>
  );
}
