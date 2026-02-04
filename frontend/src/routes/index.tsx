import { Link } from "@tanstack/react-router";
import { Zap, Shield, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { UseCasesSection } from "../components/UseCasesSection";
import { ComparisonSection } from "../components/ComparisonSection";
import { ResourceIllustration, CapacityIllustration, DeveloperIllustration } from "../components/Illustrations";
import CompanySection from "../components/CompanySection";
import HeroSection from "../components/HeroSection";

export function LandingRoute() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-emerald-500/30">
      <SEO />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0F0F0F]/80 backdrop-blur-md z-50"
      >
        <div className="font-mono font-bold text-lg tracking-tight flex gap-2 items-center">
          <img src="/logo.svg" alt="dispo.now" className="h-8 w-auto" />
          dispo.now
        </div>
        <div className="flex gap-4 text-sm font-medium text-zinc-400 items-center">
          <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
          <a href="https://github.com/riv0manana/dispo.now" className="hover:text-white transition-colors">GitHub</a>
          <Link to="/dashboard" className="text-white hover:underline decoration-emerald-500 underline-offset-4 ml-2">
            Login
          </Link>
        </div>
      </motion.nav>

      <main>
        {/* HERO SECTION */}
        <HeroSection />

        {/* USE CASES SECTION (Framer Illustrations) */}
        <div className="border-t border-white/5 bg-[#111]">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why developers choose dispo.now</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Stop reinventing the wheel. We handle the hard parts of scheduling logic.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
              >
                <div className="mb-6">
                  <ResourceIllustration />
                </div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Zap size={20} className="text-blue-400" /> Resource Agnostic
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Book rooms, equipment, doctors, or server slots. If it has capacity, we can book it.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
              >
                <div className="mb-6">
                  <CapacityIllustration />
                </div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Shield size={20} className="text-emerald-400" /> Capacity Safe
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Strict ACID compliance. No double bookings, ever. We handle the race conditions for you.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
              >
                <div className="mb-6">
                  <DeveloperIllustration />
                </div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Code2 size={20} className="text-purple-400" /> DX First
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Typed APIs, comprehensive docs, and a dashboard that respects your dark mode preference.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* USE CASES TABS SECTION */}
        <UseCasesSection />

        {/* COMPARISON SECTION */}
        <ComparisonSection />

        {/* FOR COMPANIES SECTION */}
        <CompanySection />

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="font-mono font-bold text-lg tracking-tight mb-4 flex gap-2 items-center">
                <img src="/logo.svg" alt="dispo.now" className="h-8 w-auto" />
                dispo.now
              </div>
              <p className="text-zinc-500 text-sm max-w-xs">
                The headless booking engine for modern developers.
                Copyright © {new Date().getFullYear()}.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><a href="/ui" className="hover:text-white">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="https://riv0manana.dev" className="hover:text-white">riv0manana.dev</a></li>
                <li><a href="https://github.com/riv0manana/dispo.now" className="hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
