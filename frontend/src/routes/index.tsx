import { Link } from "@tanstack/react-router";
import { ArrowRight, Zap, Shield, Code2, Server, Database, Layout } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { UseCasesSection } from "../components/UseCasesSection";
import { ComparisonSection } from "../components/ComparisonSection";
import { ResourceIllustration, CapacityIllustration, DeveloperIllustration } from "../components/Illustrations";

export function LandingRoute() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
              >
                The Booking <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Infrastructure.
                </span>
              </motion.h1>

              <motion.div variants={fadeInUp} className="text-xl text-zinc-400 max-w-lg leading-relaxed space-y-4">
                <p className="text-white font-medium text-2xl">
                  Stop rebuilding booking logic. <br/>Start shipping your product.
                </p>
                <p>
                  We handle the complex logic of availability, capacity, and concurrency so you can focus on your User Experience.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Get API Key <ArrowRight size={18} />
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 bg-zinc-900/50 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Read the Docs
                </Link>
              </motion.div>
            </motion.div>

            {/* Code Snippet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative rounded-xl border border-white/10 bg-[#161616] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="text-xs font-mono text-zinc-500">client.ts</div>
                  <div className="w-10"></div>
                </div>
                <div className="p-6 overflow-x-auto bg-[#0d0d0d]">
                  <pre className="font-mono text-sm leading-relaxed">
                    <code className="language-typescript">
                      <span className="text-purple-400">await</span> <span className="text-blue-400">createBooking</span><span className="text-zinc-300">({`{`}</span>{'\n'}
                      <span className="text-zinc-500">  // The resource you want to book</span>{'\n'}
                      <span className="text-zinc-300">  </span><span className="text-sky-300">resourceId</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"room-a"</span><span className="text-zinc-300">,</span>{'\n'}
                      <span className="text-zinc-300">  </span><span className="text-sky-300">start</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"2026-02-01T10:00:00Z"</span><span className="text-zinc-300">,</span>{'\n'}
                      <span className="text-zinc-300">  </span><span className="text-sky-300">end</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"2026-02-01T11:00:00Z"</span><span className="text-zinc-300">,</span>{'\n'}
                      <span className="text-zinc-300">  </span><span className="text-sky-300">quantity</span><span className="text-zinc-300">: </span><span className="text-orange-300">1</span>{'\n'}
                      <span className="text-zinc-300">{`}`}</span><span className="text-zinc-300">)</span>
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

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
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">For Companies</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Built for SaaS platforms and Enterprises that need control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10">
              <Database className="text-emerald-400 mb-6" size={32} />
              <h3 className="text-xl font-bold mb-3">100% Data Ownership</h3>
              <p className="text-zinc-400 leading-relaxed">
                Self-hosted. Your customer data never leaves your infrastructure. 
                Compliant with your own security policies.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10">
              <Layout className="text-blue-400 mb-6" size={32} />
              <h3 className="text-xl font-bold mb-3">White-Label Ready</h3>
              <p className="text-zinc-400 leading-relaxed">
                Since it's headless, your customers never see our brand. 
                It looks and feels exactly like your product.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10">
              <Server className="text-purple-400 mb-6" size={32} />
              <h3 className="text-xl font-bold mb-3">Multi-Tenant by Design</h3>
              <p className="text-zinc-400 leading-relaxed">
                Built to power SaaS platforms. Isolate your customers (tenants) 
                with strict project-level boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to integrate?</h2>
            <p className="text-xl text-zinc-400 mb-8">
              Get your API key in less than 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors text-lg"
              >
                Start Booking Now
              </Link>
            </div>
          </div>
        </div>

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
