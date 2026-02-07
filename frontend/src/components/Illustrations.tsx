import { motion, AnimatePresence } from "framer-motion";
import { User, Monitor, Armchair, Database, ShieldCheck, Lock, Terminal, Check, X, Car, Briefcase, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";

// --- Resource Agnostic Illustration ---
// Concept: Different entity types (User, Equipment, Room, Vehicle, Service) merging into a unified "Resource" interface
export function ResourceIllustration() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Expanded list of resource types to show true polymorphism
  const icons = [
    { icon: User, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/50", label: "Staff" },
    { icon: Armchair, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/50", label: "Space" },
    { icon: Monitor, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/50", label: "Asset" },
    { icon: Car, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/50", label: "Fleet" },
    { icon: Stethoscope, color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/50", label: "Service" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % icons.length);
    }, 2000); // Faster cycle to show variety
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-72 bg-[#111] rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
      <div className="absolute inset-0 opacity-20" 
        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Central "Engine" Hub */}
      <div className="relative z-10 w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center shadow-2xl">
        <Database size={24} className="text-zinc-400 mb-2" />
        <span className="text-[10px] font-mono text-zinc-500">CORE</span>
        
        {/* Connecting Lines */}
        {icons.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-28 h-px bg-gradient-to-r from-zinc-700 to-transparent origin-left"
            style={{ 
              top: '50%', 
              left: '50%', 
              rotate: `${i * (360 / icons.length) - 90}deg`,
              zIndex: -1 
            }}
          >
            <motion.div
              animate={{ x: [0, 112, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
              className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </motion.div>
        ))}
      </div>

      {/* Orbiting Resource Types */}
      {icons.map((item, i) => {
        const isActive = i === activeIndex;
        // Calculate position on a circle (distributed evenly)
        const angle = (i * (360 / icons.length) - 90) * (Math.PI / 180);
        const radius = 110; // Slightly larger radius for 5 items
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={i}
            animate={{ 
              scale: isActive ? 1.15 : 0.85,
              opacity: isActive ? 1 : 0.5,
              filter: isActive ? 'blur(0px)' : 'grayscale(100%)',
              zIndex: isActive ? 20 : 1
            }}
            className={`absolute flex flex-col items-center gap-2 transition-all duration-500`}
            style={{ x, y }}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border backdrop-blur-md shadow-lg ${item.bg} ${item.border}`}>
              <item.icon size={18} className={item.color} />
            </div>
            <div className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border bg-black/80 ${item.color} ${item.border}`}>
              {item.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


// --- Capacity Safe Illustration ---
// Concept: Visualizing ACID transaction locking. Two requests try to enter; one succeeds, one bounces.
export function CapacityIllustration() {
  return (
    <div className="relative w-full h-72 bg-[#111] rounded-xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #222 25%, #222 26%, transparent 27%, transparent 74%, #222 75%, #222 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #222 25%, #222 26%, transparent 27%, transparent 74%, #222 75%, #222 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
      </div>

      {/* The "Slot" Container */}
      <div className="w-full max-w-[280px] h-20 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-between px-4 relative bg-zinc-900/50">
        <span className="text-xs font-mono text-zinc-500 absolute -top-6 left-0">10:00 - 11:00 AM</span>
        
        {/* The Lock State */}
        <motion.div
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
          className="absolute inset-0 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center justify-center z-10"
        >
           <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs bg-black/80 px-3 py-1.5 rounded-full border border-emerald-500/30">
             <Lock size={12} /> LOCKED
           </div>
        </motion.div>

        {/* Request A (Success) */}
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3.2 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Check size={16} className="text-white" />
          </div>
          <span className="text-[10px] font-mono text-emerald-400">TX_1</span>
        </motion.div>

         {/* Request B (Blocked) */}
         <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 40, opacity: [0, 1, 1, 0] }} // Stops before entering
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-row-reverse items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <X size={16} className="text-white" />
          </div>
          <span className="text-[10px] font-mono text-red-400">TX_2</span>
        </motion.div>
      </div>

      <div className="mt-8 flex gap-8">
        <div className="flex flex-col items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
           <span className="text-[10px] text-zinc-500">ACID Compliant</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
           <span className="text-[10px] text-zinc-500">Serializable</span>
        </div>
      </div>
    </div>
  );
}


// --- Developer Experience Illustration ---
// Concept: A sleek IDE window typing out a typed booking request with a success toast.
export function DeveloperIllustration() {
  return (
    <div className="relative w-full h-72 bg-[#111] rounded-xl overflow-hidden border border-zinc-800 flex flex-col">
       {/* Window Header */}
       <div className="h-8 border-b border-zinc-800 bg-[#161616] flex items-center px-3 gap-2">
         <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
           <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
         </div>
         <div className="ml-4 text-[10px] text-zinc-500 font-mono flex items-center gap-1">
           <Terminal size={10} />
           booking.ts
         </div>
       </div>

       {/* Code Area */}
       <div className="p-4 font-mono text-xs relative flex-1">
         <div className="text-zinc-600 mb-2">// 1. Strongly typed SDK</div>
         
         <div className="space-y-1">
            <div className="flex">
              <span className="text-purple-400 mr-2">const</span>
              <span className="text-blue-300">booking</span>
              <span className="text-white mx-2">=</span>
              <span className="text-purple-400">await</span>
              <span className="text-blue-300 ml-2">dispo</span>
              <span className="text-zinc-400">.</span>
              <span className="text-yellow-300">bookings</span>
              <span className="text-zinc-400">.</span>
              <span className="text-yellow-300">create</span>
              <span className="text-zinc-400">(</span>
              <span className="text-zinc-400">{`{`}</span>
            </div>
            
            {/* Animated Typing Lines */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="pl-4"
            >
               <span className="text-sky-300">resourceId</span>
               <span className="text-zinc-400">:</span>
               <span className="text-orange-300 ml-2">"room_a"</span>
               <span className="text-zinc-500">,</span>
            </motion.div>
            
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="pl-4"
            >
               <span className="text-sky-300">start</span>
               <span className="text-zinc-400">:</span>
               <span className="text-blue-400 ml-2">Date</span>
               <span className="text-zinc-400">.</span>
               <span className="text-yellow-300">now</span>
               <span className="text-zinc-400">()</span>
               <span className="text-zinc-500">,</span>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.1 }}
               className="pl-4"
            >
               <span className="text-sky-300">duration</span>
               <span className="text-zinc-400">:</span>
               <span className="text-emerald-300 ml-2">60</span>
               <span className="text-zinc-500">,</span>
            </motion.div>

            <div>
              <span className="text-zinc-400">{`}`}</span>
              <span className="text-zinc-400">)</span>
              <span className="text-zinc-500">;</span>
              <motion.span
                 animate={{ opacity: [0, 1, 0] }}
                 transition={{ duration: 0.8, repeat: Infinity }}
                 className="inline-block w-1.5 h-4 bg-emerald-500 ml-1 align-middle"
              />
            </div>
         </div>

         {/* Intelligent Tooltip Simulation */}
         <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="absolute top-1/2 right-4 bg-[#1e1e1e] border border-zinc-700 p-3 rounded-lg shadow-2xl z-20 max-w-[180px]"
         >
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-2">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span className="text-[10px] text-zinc-400">Type Check</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-24 bg-zinc-800 rounded"></div>
              <div className="h-1.5 w-16 bg-zinc-800 rounded"></div>
            </div>
         </motion.div>
       </div>
    </div>
  );
}
