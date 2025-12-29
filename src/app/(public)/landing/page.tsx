import CTASection from "./components/CTASection";
import FeaturesGrid from "./components/FeaturesGrid";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import RolePreviewCards from "./components/RolePreviewCards";
import TestimonialsCarousel from "./components/TestimonialsCarousel";


export default function LandingPage() {
return (
<main className="flex flex-col">
<HeroSection />
<FeaturesGrid />
<HowItWorks />
<RolePreviewCards />
<TestimonialsCarousel />
<CTASection />
</main>
);
}