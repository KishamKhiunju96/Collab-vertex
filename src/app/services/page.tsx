import type { Metadata } from "next";
import Container from "../ui/Container";
import PageHeader from "../ui/PageHeader";
import ServiceCard from "../ui/ServiceCard";

export const metadata: Metadata = {
  title: "Services | Collab-vertex",
};

const services = [
  {
    title: "Brand–Influencer Matchmaking",
    description:
      "We connect brands with the right influencers based on audience, niche, and campaign goals—ensuring authentic collaborations that drive real impact and engagement.",
  },
  {
    title: "Campaign & Event Collaboration",
    description:
      "Plan, manage, and execute influencer-driven campaigns and events from a single platform, streamlining communication, timelines, and deliverables.",
  },
  {
    title: "Creative Strategy & Content Direction",
    description:
      "Our team helps define campaign concepts, messaging, and content strategies that align with brand identity while allowing influencers to stay authentic.",
  },
  {
    title: "Performance Tracking & Insights",
    description:
      "Measure campaign success with real-time analytics, engagement metrics, and performance insights to optimize future collaborations and maximize ROI.",
  },
  {
    title: "Secure Collaboration & Payments",
    description:
      "Handle agreements, approvals, and payments securely—giving both brands and influencers transparency, trust, and peace of mind throughout the collaboration.",
  },
];

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-background-light text-text-primary py-20">
      <Container>
        <PageHeader title="Our Services" description=""></PageHeader>
        <div className="grid gird-6 sm:grid-col-2 lg: grid-col-4">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
