import { LandingTemplate } from "../components/templates/LandingTemplate";
import { UseCasesSection } from "../components/UseCasesSection";
import { ComparisonSection } from "../components/ComparisonSection";
import CompanySection from "../components/CompanySection";
import HeroSection from "../components/HeroSection";
import { McpSection } from "../components/McpSection";
import { FeaturesGrid } from "../components/ui/organisms/FeaturesGrid";
import { DashboardFlowIllustration } from "../components/ui/organisms/DashboardFlowIllustration";

export function LandingRoute() {
  return (
    <LandingTemplate>
      {/* HERO SECTION */}
      <HeroSection />

      {/* NEW ILLUSTRATION SECTION */}
      <div className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase mb-2 block">The Workflow</span>
          <h2 className="text-3xl font-bold text-white mb-4">From Setup to Booking in Seconds</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            A visual guide to how dispo.now orchestrates your scheduling infrastructure.
          </p>
        </div>
        <DashboardFlowIllustration />
      </div>

      {/* USE CASES TABS SECTION */}
      <UseCasesSection />

      {/* FEATURES GRID (Replacing direct illustration import) */}
      <FeaturesGrid />

      {/* MCP SECTION */}
      <McpSection />

      {/* COMPARISON SECTION */}
      <ComparisonSection />

      {/* FOR COMPANIES SECTION */}
      <CompanySection />
    </LandingTemplate>
  );
}
