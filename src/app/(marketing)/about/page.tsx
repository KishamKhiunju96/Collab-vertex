import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Collab-vertex",
  description: "Learn more about the Collab-vertex",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 text-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            About Collab Vertex
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We build collaborative digital experiences for modern teams.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-10 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6 text-left text-gray-700 text-lg leading-relaxed">
            <p>
              <span className="font-semibold text-2xl text-gray-900">
                Collab Vertex
              </span>{" "}
              is a modern collaboration-focused platform designed to help teams
              build, scale, and innovate faster.
            </p>
            <p>
              We focus on clean design, scalable architecture, and seamless user
              experience to deliver products that truly matter.
            </p>
            <p>
              Our mission is to empower brands, startups, and influencers
              through high-quality digital solutions and meaningful
              collaborations.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Our Values
            </h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-xl">✓</span>
                <span>Collaboration First</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-xl">✓</span>
                <span>Performance Driven</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-xl">✓</span>
                <span>Clean and Scalable Code</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-3 text-xl">✓</span>
                <span>User-Centric Design</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900">
                Mission-Driven
              </h3>
              <p className="text-gray-600">
                We are committed to creating meaningful connections between
                brands and influencers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900">
                Innovation First
              </h3>
              <p className="text-gray-600">
                We leverage cutting-edge technology to deliver exceptional
                experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900">
                Partnership Focus
              </h3>
              <p className="text-gray-600">
                We build lasting relationships based on trust and mutual
                success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
