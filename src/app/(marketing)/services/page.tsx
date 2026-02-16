import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Collab-vertex",
  description:
    "Explore our comprehensive influencer marketing and brand collaboration services",
};

const services = [
  {
    title: "Brand–Influencer Matchmaking",
    description:
      "We connect brands with the right influencers based on audience, niche, and campaign goals—ensuring authentic collaborations that drive real impact and engagement.",
    icon: "🎯",
  },
  {
    title: "Campaign & Event Collaboration",
    description:
      "Plan, manage, and execute influencer-driven campaigns and events from a single platform, streamlining communication, timelines, and deliverables.",
    icon: "📅",
  },
  {
    title: "Creative Strategy & Content Direction",
    description:
      "Our team helps define campaign concepts, messaging, and content strategies that align with brand identity while allowing influencers to stay authentic.",
    icon: "🎨",
  },
  {
    title: "Performance Tracking & Insights",
    description:
      "Measure campaign success with real-time analytics, engagement metrics, and performance insights to optimize future collaborations and maximize ROI.",
    icon: "📊",
  },
  {
    title: "Secure Collaboration & Payments",
    description:
      "Handle agreements, approvals, and payments securely—giving both brands and influencers transparency, trust, and peace of mind throughout the collaboration.",
    icon: "🔒",
  },
  {
    title: "Community Building & Management",
    description:
      "Build lasting relationships with influencers and create a community around your brand through consistent engagement and meaningful partnerships.",
    icon: "🤝",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 text-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions to connect brands with influencers and drive
            successful collaborations
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-4xl">{service.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of brands and influencers who trust Collab Vertex for
            their collaboration needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Create Account
            </a>
            <a
              href="/contacts"
              className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition border-2 border-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
