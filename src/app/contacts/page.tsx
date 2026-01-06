"use client";

import { useState } from "react";
import Container from "../ui/Container";
import PageHeader from "../ui/PageHeader";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Message sent successfully..");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background-light text-text-primary">
      <main>
        <Container>
          <PageHeader
            title="Contact Us"
            description="We’re here to help and would love to hear from you. Whether you have a question about our services, need a custom quote, want to discuss a potential project, or simply want to share feedback, our team is ready to respond. Drop us a message using the form below, and we’ll get back to you as soon as possible. "
          ></PageHeader>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl  space-y-6"
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full rounded-lg bg-gray-200 border border-gray-950 px-4 py-3  text-text-primary   focus:border-green-500 "
            ></input>

            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full rounded-lg bg-gray-200 border border-gray-950 px-4 py-3  text-text-primary   focus:border-green-500"
            ></input>

            <textarea
              placeholder="Your Message"
              rows={20}
              required
              className="w-full h-28 rounded-lg bg-gray-200 border border-gray-950 px-4 py-3 text-text-primary focus:border-green-500"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-400 hover:bg-green-300 border border-gray-950 px-4 py-3 text-text-primary"
            >
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        </Container>
      </main>
    </main>
  );
}
