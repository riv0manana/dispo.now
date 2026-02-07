import { motion } from "framer-motion";

interface SlotDurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
  options?: number[];
}

export function SlotDurationSelector({ 
  value, 
  onChange, 
  options = [60, 30, 15] 
}: SlotDurationSelectorProps) {
  return (
    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
      {options.map((duration) => (
        <button
          key={duration}
          type="button"
          onClick={() => onChange(duration)}
          className={`
            relative px-2 py-0.5 text-[10px] font-medium rounded-md transition-all z-10
            ${value === duration 
              ? 'text-white' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
          `}
        >
          {value === duration && (
            <motion.div
              layoutId="activeDuration"
              className="absolute inset-0 bg-zinc-800 rounded-md -z-10 shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {duration}m
        </button>
      ))}
    </div>
  );
}
