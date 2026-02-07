import { Check, X, Server, Database, ShieldCheck, DollarSign, Cloud, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ComparisonSection() {
  const { t } = useTranslation();

  const comparisons = [
    {
      title: t('comparison.items.sovereignty.title'),
      icon: Database,
      saas: {
        title: t('comparison.items.sovereignty.saas.title'),
        desc: t('comparison.items.sovereignty.saas.desc'),
        status: "risk",
        points: t('comparison.items.sovereignty.saas.points', { returnObjects: true }) as string[]
      },
      dispo: {
        title: "dispo.now",
        desc: t('comparison.items.sovereignty.dispo.desc'),
        status: "success",
        points: t('comparison.items.sovereignty.dispo.points', { returnObjects: true }) as string[]
      }
    },
    {
      title: t('comparison.items.cost.title'),
      icon: DollarSign,
      saas: {
        title: t('comparison.items.cost.saas.title'),
        desc: t('comparison.items.cost.saas.desc'),
        status: "risk",
        points: t('comparison.items.cost.saas.points', { returnObjects: true }) as string[]
      },
      dispo: {
        title: "dispo.now",
        desc: t('comparison.items.cost.dispo.desc'),
        status: "success",
        points: t('comparison.items.cost.dispo.points', { returnObjects: true }) as string[]
      }
    },
    {
      title: t('comparison.items.correctness.title'),
      icon: Lock,
      saas: {
        title: t('comparison.items.correctness.saas.title'),
        desc: t('comparison.items.correctness.saas.desc'),
        status: "risk",
        points: t('comparison.items.correctness.saas.points', { returnObjects: true }) as string[]
      },
      dispo: {
        title: "dispo.now",
        desc: t('comparison.items.correctness.dispo.desc'),
        status: "success",
        points: t('comparison.items.correctness.dispo.points', { returnObjects: true }) as string[]
      }
    }
  ];

  return (
    <section className="py-24 border-t border-white/5 bg-[#0F0F0F] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono mb-4"
          >
            <Server size={12} />
            <span>{t('comparison.badge')}</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            {t('comparison.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            {t('comparison.description')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {comparisons.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-linear-to-b from-zinc-800/20 to-transparent rounded-2xl -z-10" />
                    <div className="p-1 rounded-2xl bg-zinc-900 border border-white/5 h-full flex flex-col">
                        
                        {/* Header */}
                        <div className="p-6 text-center border-b border-white/5 bg-zinc-900/50 rounded-t-xl">
                            <div className="w-12 h-12 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        </div>

                        {/* SaaS Side (The Problem) */}
                        <div className="p-6 bg-red-500/5 border-b border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{t('comparison.problem')}</span>
                                <Cloud size={14} className="text-red-400/50" />
                            </div>
                            <h4 className="font-semibold text-zinc-300 mb-1">{item.saas.title}</h4>
                            <p className="text-sm text-zinc-500 mb-4">{item.saas.desc}</p>
                            <ul className="space-y-2">
                                {item.saas.points.map((pt, j) => (
                                    <li key={j} className="flex items-start gap-2 text-xs text-zinc-500">
                                        <X size={12} className="mt-0.5 text-red-500/50 shrink-0" />
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dispo Side (The Solution) */}
                        <div className="p-6 bg-emerald-500/5 flex-1 rounded-b-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
                            
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t('comparison.solution')}</span>
                                <ShieldCheck size={14} className="text-emerald-400/50" />
                            </div>
                            <h4 className="font-semibold text-white mb-1">{item.dispo.title}</h4>
                            <p className="text-sm text-zinc-400 mb-4">{item.dispo.desc}</p>
                            <ul className="space-y-2">
                                {item.dispo.points.map((pt, j) => (
                                    <li key={j} className="flex items-start gap-2 text-xs text-zinc-300">
                                        <Check size={12} className="mt-0.5 text-emerald-500 shrink-0" />
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="mt-20 text-center">
             <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm hover:border-emerald-500/30 transition-colors cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span>{t('comparison.ready')}</span>
             </div>
        </div>
      </div>
    </section>
  );
}
