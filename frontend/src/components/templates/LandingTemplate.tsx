import { LazyMotion, domAnimation } from "framer-motion";
import { LandingNavbar } from "../ui/molecules/LandingNavbar";
import { LandingFooter } from "../ui/organisms/LandingFooter";
import { ScrollToTopButton } from "../ui/atoms/ScrollToTopButton";
import { SEO } from "../SEO";

interface LandingTemplateProps {
  children: React.ReactNode;
}

export function LandingTemplate({ children }: LandingTemplateProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-emerald-500/30">
        <SEO />
        <LandingNavbar />
        <main>
          {children}
        </main>
        <LandingFooter />
        <ScrollToTopButton />
      </div>
    </LazyMotion>
  );
}
