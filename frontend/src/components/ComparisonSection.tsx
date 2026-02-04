import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const challenges = [
  {
    title: "Concurrency & Race Conditions",
    problem: "Two users click 'Book' at the exact same millisecond. Naive implementations often double-book.",
    solution: "We use database-level locking and atomic transactions to ensure strict consistency."
  },
  {
    title: "Resource Modeling",
    problem: "Hardcoding 'Rooms' or 'Doctors' makes your system rigid and hard to adapt.",
    solution: "Our Resource Agnostic design allows you to model any bookable entity with the same API."
  },
  {
    title: "Multi-Resource Atomicity",
    problem: "Booking a Doctor AND a Room? If one fails, you're left with corrupted state.",
    solution: "All-or-nothing transactions. The entire group booking succeeds or fails together."
  },
  {
    title: "Time Zones & Recurrence",
    problem: "Handling 'Every 3rd Friday' across time zones is a maintenance nightmare.",
    solution: "Built-in recurrence expansion and strict UTC standardization handling."
  }
];

export function ComparisonSection() {
  return (
    <section className="py-24 border-t border-white/5 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">Solved Engineering Problems</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Booking logic is deceptively simple until you hit the edge cases.
            We handle the complexity so you don't have to.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-2xl bg-zinc-900/30 border border-white/10 hover:bg-zinc-900/50 transition-colors"
                >
                    <h3 className="text-xl font-bold text-white mb-6">{item.title}</h3>
                    
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                <X size={16} className="text-red-500" />
                            </div>
                            <div>
                                <div className="text-xs font-mono text-red-400 mb-1 uppercase tracking-wider">The Problem</div>
                                <p className="text-zinc-400 text-sm leading-relaxed">{item.problem}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check size={16} className="text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-xs font-mono text-emerald-400 mb-1 uppercase tracking-wider">Our Solution</div>
                                <p className="text-zinc-300 text-sm leading-relaxed font-medium">{item.solution}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="mt-16 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Ready to deploy in production
             </div>
        </div>
      </div>
    </section>
  );
}
