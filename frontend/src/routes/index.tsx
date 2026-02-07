import { LandingTemplate } from "../components/templates/LandingTemplate";
import { UseCasesSection } from "../components/UseCasesSection";
import { ComparisonSection } from "../components/ComparisonSection";
import CompanySection from "../components/CompanySection";
import HeroSection from "../components/HeroSection";
import { McpSection } from "../components/McpSection";
import { FeaturesGrid } from "../components/ui/organisms/FeaturesGrid";
import { ArchitectureFlowIllustration } from "../components/ui/organisms/ArchitectureFlowIllustration";
import { FAQSection } from "../components/FAQSection";
import { useTranslation } from "react-i18next";

export function LandingRoute() {
  const { t } = useTranslation();
  
  return (
    <LandingTemplate>
      {/* HERO SECTION */}
      <div id="home">
        <HeroSection />
      </div>

      {/* ARCHITECTURE FLOW SECTION */}
      <div id="workflow" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/5 scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('workflow.title')}
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {t('workflow.subtitle')}
          </p>
        </div>
        <ArchitectureFlowIllustration />
      </div>

      {/* USE CASES TABS SECTION */}
      <div id="use-cases" className="scroll-mt-20">
        <UseCasesSection />
      </div>

      {/* FEATURES GRID (Replacing direct illustration import) */}
      <div id="features" className="scroll-mt-20">
        <FeaturesGrid />
      </div>

      {/* MCP SECTION */}
      <div id="mcp" className="scroll-mt-20">
        <McpSection />
      </div>

      {/* COMPARISON SECTION */}
      <div id="comparison" className="scroll-mt-20">
        <ComparisonSection />
      </div>
      
      {/* FAQ SECTION */}
      <div id="faq" className="scroll-mt-20">
        <FAQSection />
      </div>

      {/* FOR COMPANIES SECTION */}
      <div id="companies" className="scroll-mt-20">
        <CompanySection />
      </div>
    </LandingTemplate>
  );
}
