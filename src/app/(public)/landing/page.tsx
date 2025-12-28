import FeaturesGrid from "./components/FeaturesGrid";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import RolePreviewCards from "./components/RolePreviewCards";


export default function LandingPage() {
return (
<main className="flex flex-col">
<HeroSection />
<FeaturesGrid />
<HowItWorks />
<RolePreviewCards />
</main>
);
}