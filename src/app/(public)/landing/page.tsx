import CTASection from "@/components/landing/CTASection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import RolePreviewCards from "@/components/landing/RolePreviewCards";
import TestimonialsCarousel from "@/components/landing/TestimonialsCarousel";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";





export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background-hero">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <RolePreviewCards />
      <TestimonialsCarousel />
      <CTASection />
      <Footer />
    </main>
  );
}
