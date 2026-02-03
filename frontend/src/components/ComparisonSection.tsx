import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const features = [
  {
    name: "Primary Focus",
    dispo: "Generic Resources",
    cal: "Meetings",
    custom: "Anything"
  },
  {
    name: "User Interface",
    dispo: "Headless (100% Custom)",
    cal: "Pre-built (Rigid)",
    custom: "You build it"
  },
  {
    name: "Logic Engine",
    dispo: "Capacity & Concurrency",
    cal: "Scheduling Only",
    custom: "You write it (Hard)"
  },
  {
    name: "Deployment",
    dispo: "Self-Hosted / Docker",
    cal: "SaaS / Open Core",
    custom: "Self-Hosted"
  },
  {
    name: "Multi-Tenant",
    dispo: "Native (Projects)",
    cal: "Enterprise Only",
    custom: "You build it"
  },
  {
    name: "Speed to Market",
    dispo: "⚡ Fast",
    cal: "⚡ Fast (for meetings)",
    custom: "🐢 Slow"
  }
];

export function ComparisonSection() {
  return (
    <section className="py-24 border-t border-white/5 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">Why dispo.now?</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Most booking systems are built for meetings. We are built for everything else.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] bg-zinc-900/30 rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-4 p-6 border-b border-white/10 bg-zinc-900/50">
              <div className="col-span-1 text-zinc-500 font-mono text-sm uppercase tracking-wider">Feature</div>
              <div className="col-span-1 text-emerald-400 font-bold text-lg">dispo.now</div>
              <div className="col-span-1 text-zinc-300 font-medium">Calendly / Cal.com</div>
              <div className="col-span-1 text-zinc-500 font-medium">Custom Build</div>
            </div>
            
            <div className="divide-y divide-white/5">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="grid grid-cols-4 p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="col-span-1 text-zinc-400 font-medium">{feature.name}</div>
                  <div className={cn(
                    "col-span-1 font-medium",
                    feature.dispo.includes("⚡") ? "text-yellow-400" : "text-emerald-400"
                  )}>
                    {feature.dispo}
                  </div>
                  <div className="col-span-1 text-zinc-400">{feature.cal}</div>
                  <div className="col-span-1 text-zinc-500">{feature.custom}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-zinc-900 border border-emerald-500/20">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Choose dispo.now if...</h3>
                <ul className="space-y-3">
                    {[
                        "You are building a marketplace (e.g. 'Airbnb for X')",
                        "You manage physical inventory (rentals, equipment)",
                        "You need strict capacity safety (no overbooking)",
                        "You want to own your data (Self-hosted)"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-300">
                            <Check className="text-emerald-500 mt-1 shrink-0" size={16} />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/10">
                <h3 className="text-xl font-bold text-zinc-400 mb-4">Choose Calendly if...</h3>
                <ul className="space-y-3">
                    {[
                        "You just need a link to schedule Zoom calls",
                        "You want a ready-made UI you don't have to code",
                        "You don't mind your data living on their servers"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-400">
                            <Check className="text-zinc-600 mt-1 shrink-0" size={16} />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </section>
  );
}
