import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import HowItWorks from "@/components/home/HowItWorks";
import InfluencerShowcase from "@/components/home/InfluencerShowcase";
import Testimonials from "@/components/home/Testimonials";
import SearchPreview from "@/components/home/SearchPreview";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import CallToAction from "@/components/home/CallToAction";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function HomePage() {
  const [location] = useLocation();

  // Handle smooth scrolling to sections (e.g., when clicking "How It Works" in navbar)
  useEffect(() => {
    if (location.includes("#")) {
      const id = location.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div>
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <InfluencerShowcase />
      <Testimonials />
      <SearchPreview />
      <FeaturesGrid />
      <CallToAction />
    </div>
  );
}
