import { motion } from "framer-motion";

export function ResourceIllustration() {
  return (
    <div className="relative w-full h-64 bg-[#111] rounded-xl overflow-hidden border border-zinc-800">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20" 
        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-12 h-12 bg-emerald-500/20 rounded-lg border border-emerald-500/50 flex items-center justify-center"
      >
        <div className="w-6 h-6 bg-emerald-500 rounded-md"></div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-500/20 rounded-full border border-blue-500/50 flex items-center justify-center"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
      </motion.div>

      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/3 w-24 h-8 bg-purple-500/20 rounded-full border border-purple-500/50"
      >
      </motion.div>
    </div>
  );
}

export function CapacityIllustration() {
  return (
    <div className="relative w-full h-64 bg-[#111] rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center gap-2">
       {[...Array(5)].map((_, i) => (
         <motion.div
            key={i}
            initial={{ height: 20 }}
            animate={{ height: [20, 60 + (i % 2 === 0 ? 30 : 10), 20] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-8 bg-linear-to-t from-emerald-500 to-emerald-300 rounded-t-sm opacity-80"
         />
       ))}
       <div className="absolute bottom-0 w-full h-px bg-white/20"></div>
    </div>
  );
}

export function DeveloperIllustration() {
  return (
    <div className="relative w-full h-64 bg-[#111] rounded-xl overflow-hidden border border-zinc-800 p-4 font-mono text-xs">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-purple-400">const</span> booking = <span className="text-blue-400">await</span> api.create();
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-2 text-zinc-500"
      >
        // → {`{ id: "book_123", status: "confirmed" }`}
      </motion.div>
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-4 h-1 bg-emerald-500/50 rounded-full origin-left"
      ></motion.div>
    </div>
  );
}
