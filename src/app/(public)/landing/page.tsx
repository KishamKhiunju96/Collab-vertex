import Navbar from "@/components/common/Navbar";
import CTASection from "./components/CTASection";
import FeaturesGrid from "./components/FeaturesGrid";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import RolePreviewCards from "./components/RolePreviewCards";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import Footer from "@/components/common/Footer";


export default function LandingPage() {
return (
<main className="flex flex-col">
  <Navbar/>
<HeroSection />
<FeaturesGrid />
<HowItWorks />
<RolePreviewCards />
<TestimonialsCarousel />
<CTASection />
<Footer/>
</main>
);
}
