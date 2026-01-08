import type { Metadata } from "next";
import Container from "../../../components/uui/Container";
import PageHeader from "../../../components/uui/PageHeader";

export const metadata: Metadata = {
  title: "About | Collab-vertex",
  description: "Learn more about the Collab-vertex",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background-light text-text-primary py-20">
      <Container>
        <PageHeader
          title=" About Collab-vertex"
          description="We build collaborative digital experiences for modern teams."
        ></PageHeader>
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-6 text-left text-text-primary text-xl leading-relaxed ">
            <p>
              <span className="font-semibold text-2xl text-text-primary">
                Collab Vertex
              </span>{" "}
              is modern collaboration-focused platform design to help teams
              buuld, scale, and innovate faster.
            </p>
            <p>
              We focus on clean design, scalable architecture and seamless user
              experience to deliver products that truely matter.
            </p>
            <p>
              Our mission is used to empower brands, starts up for influencers,
              and collaborations through high-quality digital solotions.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 p-8">
            <h3 className="text-xl font-semibold mb-4">Our values</h3>
            <ul className="space-y-3 text-text-primary">
              <li>Collaboration First</li>
              <li>Perfomance Driven</li>
              <li>Clean and scalable code</li>
              <li>User-centric design</li>
            </ul>
          </div>
        </div>
      </Container>
    </main>
  );
}
