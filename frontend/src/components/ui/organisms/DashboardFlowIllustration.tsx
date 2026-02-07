import { m, useScroll, useTransform, useSpring } from "framer-motion";
import { Folder, Box, Check, MousePointer2, Plus, Calendar, Clock, User, Zap } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export function DashboardFlowIllustration() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [50, -50]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]), springConfig);

  return (
    <m.div 
      ref={containerRef}
      style={{ scale, opacity }}
      className="relative w-full max-w-6xl mx-auto aspect-auto h-[800px] md:h-auto md:aspect-[21/9] bg-[#0F0F0F] rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl"
    >
      {/* Background Grid with Parallax */}
      <m.div 
        style={{ y }}
        className="absolute inset-0 opacity-20 pointer-events-none"
      >
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }}
        />
      </m.div>

      {/* Main Flow Container */}
      <div className="relative z-10 h-full w-full flex items-center justify-center p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-stretch justify-between w-full h-full gap-4 md:gap-8">
          
          {/* Panel 1: Project & Resources (Sidebar) */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 bg-[#161616] rounded-xl border border-zinc-800 p-4 flex flex-col gap-4 shadow-lg"
          >
            {/* Mock Header */}
            <div className="h-8 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>

            {/* Project Item */}
            <m.div 
              className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Folder size={16} className="text-blue-400" />
              <div className="flex-1">
                <div className="h-2 w-20 bg-blue-400/20 rounded mb-1" />
                <div className="h-1.5 w-12 bg-zinc-700 rounded" />
              </div>
            </m.div>

            {/* Resources List */}
            <div className="space-y-2 mt-2">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{t('dashboard.resources')}</div>
              {[1, 2, 3].map((i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
                >
                  <Box size={14} className="text-purple-400" />
                  <div className="h-1.5 w-16 bg-zinc-700 rounded" />
                </m.div>
              ))}
              <m.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 text-zinc-500 text-xs px-2 pt-2"
              >
                <Plus size={12} /> {t('dashboard.addResource')}
              </m.div>
            </div>
          </m.div>

          {/* Panel 2: Booking Calendar (Main Area) */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex-[2] bg-[#161616] rounded-xl border border-zinc-800 p-4 flex flex-col shadow-lg relative overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-zinc-400" />
                <div className="h-2 w-24 bg-zinc-700 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-zinc-800 rounded" />
                <div className="h-6 w-6 bg-emerald-500 rounded flex items-center justify-center">
                  <Plus size={14} className="text-white" />
                </div>
              </div>
            </div>

            {/* Calendar Grid Animation */}
            <div className="grid grid-cols-4 gap-3 flex-1">
              {[...Array(8)].map((_, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                  className={`rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3 flex flex-col justify-between group hover:border-zinc-700 transition-colors ${i === 2 ? 'ring-2 ring-emerald-500/50 bg-emerald-500/5' : ''}`}
                >
                  <div className="h-1.5 w-8 bg-zinc-800 rounded mb-2" />
                  {i === 2 && (
                    <m.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="mt-auto"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={10} className="text-emerald-400" />
                        <div className="h-1 w-10 bg-emerald-500/30 rounded" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={10} className="text-emerald-400" />
                        <div className="h-1 w-8 bg-emerald-500/30 rounded" />
                      </div>
                    </m.div>
                  )}
                </m.div>
              ))}
            </div>

            {/* Interaction Layer */}
            <m.div
              initial={{ opacity: 0, x: 100, y: 100 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "circOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <MousePointer2 size={24} className="text-white drop-shadow-md fill-black" />
            </m.div>

            {/* Success Toast */}
            <m.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, type: "spring" }}
              className="absolute bottom-6 right-6 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 z-30"
            >
              <div className="bg-white/20 p-1 rounded-full">
                <Check size={14} strokeWidth={3} />
              </div>
              <div className="text-xs font-medium">{t('dashboard.bookingConfirmed')}</div>
            </m.div>
          </m.div>

          {/* Panel 3: API Log (Sidebar) */}
          <m.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-1 bg-[#161616] rounded-xl border border-zinc-800 p-4 flex-col gap-3 shadow-lg font-mono text-[10px]"
          >
            <div className="text-zinc-500 uppercase tracking-wider mb-2">{t('dashboard.liveLogs')}</div>
            <m.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex gap-2 text-blue-400"
            >
              <span>POST</span>
              <span className="text-zinc-400">/api/bookings</span>
            </m.div>
            <m.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="pl-4 text-zinc-500"
            >
              {t('dashboard.checkingAvailability')}
            </m.div>
            <m.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="flex gap-2 text-emerald-400"
            >
              <span>201</span>
              <span className="text-zinc-400">{t('dashboard.created')}</span>
              <Zap size={10} className="ml-auto" />
            </m.div>
          </m.div>

        </div>
      </div>
    </m.div>
  );
}
