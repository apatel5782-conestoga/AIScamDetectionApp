import HeroSection from "../components/HeroSection";
import ScamCheckerCard from "../components/ScamCheckerCard";
import FeaturesSection from "../components/FeaturesSection";

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />

      <div className="max-w-6xl mx-auto px-4 -mt-8 md:-mt-10 relative z-10">
        <ScamCheckerCard />
      </div>

      <FeaturesSection />
    </main>
  );
}
