import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, 
  Stethoscope, 
  Users, 
  Building2, 
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  CalendarCheck,
  Repeat
} from "lucide-react";
import { cn } from "../lib/utils";

// --- Visual Components ---

const AvailabilityVisual = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl p-6 relative">
      <div className="w-full max-w-xs space-y-3">
        <div className="flex justify-between items-center mb-4">
          <span className="text-zinc-400 text-xs font-mono">Available Slots</span>
          <span className="text-emerald-400 text-xs font-mono">2024-06-01</span>
        </div>
        
        {[
          { time: "09:00 - 10:00", status: "available", slots: 5 },
          { time: "10:00 - 11:00", status: "partial", slots: 2 },
          { time: "11:00 - 12:00", status: "full", slots: 0 },
          { time: "12:00 - 13:00", status: "available", slots: 5 },
        ].map((slot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border",
              slot.status === "full" 
                ? "bg-red-500/5 border-red-500/20 opacity-50" 
                : "bg-zinc-800/50 border-zinc-700"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                slot.status === "available" ? "bg-emerald-500" :
                slot.status === "partial" ? "bg-yellow-500" : "bg-red-500"
              )} />
              <span className="text-zinc-300 text-sm font-mono">{slot.time}</span>
            </div>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded",
              slot.status === "full" ? "text-red-400 bg-red-500/10" : "text-zinc-400 bg-zinc-800"
            )}>
              {slot.slots} left
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CarRentalVisual = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl p-6 relative overflow-hidden">
      {/* Road/Parking Spot */}
      <div className="absolute bottom-10 left-0 right-0 h-24 bg-zinc-800/30 skew-x-12 transform origin-bottom" />
      
      {/* Parking Spot Marker */}
      <div className="absolute bottom-12 border-2 border-dashed border-zinc-700 w-32 h-48 rounded-lg flex items-center justify-center">
        <span className="text-zinc-600 font-mono text-xs mt-32">SPOT A-1</span>
      </div>

      {/* The Car */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          duration: 1.5, 
          ease: "backOut", 
          repeat: Infinity, 
          repeatDelay: 3 
        }}
        className="z-10 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-sm"
      >
        <Car className="text-emerald-400 w-12 h-12" />
      </motion.div>

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.3, repeat: Infinity, repeatDelay: 4.2 }}
        className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30"
      >
        <CheckCircle2 size={14} />
        <span className="text-xs font-bold uppercase tracking-wider">Booked</span>
      </motion.div>
    </div>
  );
};

const HealthcareVisual = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl p-6 gap-6 relative">
      <div className="flex gap-4 items-center z-10">
        {/* Doctor Resource */}
        <motion.div 
          animate={{ 
            borderColor: ["#27272a", "#10b981", "#27272a"],
            backgroundColor: ["rgba(24, 24, 27, 0.5)", "rgba(16, 185, 129, 0.1)", "rgba(24, 24, 27, 0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center w-28"
        >
          <Stethoscope className="text-blue-400 mb-2" size={24} />
          <span className="text-xs text-zinc-400 font-mono">Dr. Smith</span>
        </motion.div>

        {/* Link Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="text-yellow-400" size={20} />
        </motion.div>

        {/* Room Resource */}
        <motion.div 
          animate={{ 
            borderColor: ["#27272a", "#10b981", "#27272a"],
            backgroundColor: ["rgba(24, 24, 27, 0.5)", "rgba(16, 185, 129, 0.1)", "rgba(24, 24, 27, 0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col items-center w-28"
        >
          <Building2 className="text-purple-400 mb-2" size={24} />
          <span className="text-xs text-zinc-400 font-mono">Room 101</span>
        </motion.div>
      </div>

      {/* Atomic Label */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex items-center gap-2 text-zinc-500 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800"
      >
        <Lock size={14} className="text-emerald-500" />
        <span className="text-xs font-mono">ATOMIC TRANSACTION</span>
      </motion.div>
    </div>
  );
};

const CourseVisual = () => {
  const [count, setCount] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev > 45 ? prev - 1 : 50);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl p-6 relative">
      <div className="w-full max-w-[200px] space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-zinc-400 text-sm font-medium">Webinar Capacity</span>
          <span className="text-emerald-400 font-mono text-xl font-bold">{count}<span className="text-zinc-600 text-sm">/50</span></span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden relative">
          <motion.div 
            animate={{ width: `${(count / 50) * 100}%` }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
          />
        </div>

        {/* User Bubbles */}
        <div className="flex -space-x-2 overflow-hidden py-2">
           {[...Array(5)].map((_, i) => (
             <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#111] flex items-center justify-center"
             >
               <Users size={14} className="text-zinc-500" />
             </motion.div>
           ))}
           <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-[#111] flex items-center justify-center text-[10px] text-zinc-500 font-mono">
             +{count}
           </div>
        </div>
      </div>
    </div>
  );
};

const SaasVisual = () => {
  const [tenant, setTenant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const interval = setInterval(() => {
      setTenant(prev => prev === 'A' ? 'B' : 'A');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl p-6 relative">
      <div className="bg-[#050505] border border-zinc-800 rounded-lg w-64 overflow-hidden shadow-xl">
        {/* Header Switcher */}
        <div className="flex border-b border-zinc-800">
          <div className={cn(
            "flex-1 py-2 text-center text-xs font-mono transition-colors duration-500",
            tenant === 'A' ? "bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500" : "text-zinc-600"
          )}>
            Tenant A
          </div>
          <div className={cn(
            "flex-1 py-2 text-center text-xs font-mono transition-colors duration-500",
            tenant === 'B' ? "bg-orange-500/10 text-orange-400 border-b-2 border-orange-500" : "text-zinc-600"
          )}>
            Tenant B
          </div>
        </div>

        {/* Isolated Content */}
        <div className="p-4 space-y-3">
          <motion.div
            key={tenant}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs">Project ID</span>
              <code className="text-zinc-300 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">
                {tenant === 'A' ? 'proj_salon_nyc' : 'proj_gym_la'}
              </code>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="space-y-2">
              <div className={cn("h-2 rounded w-3/4", tenant === 'A' ? "bg-indigo-900/50" : "bg-orange-900/50")} />
              <div className={cn("h-2 rounded w-1/2", tenant === 'A' ? "bg-indigo-900/30" : "bg-orange-900/30")} />
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute -bottom-2 flex gap-2">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Strict Isolation</span>
      </div>
    </div>
  );
};

const RecurringVisual = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl p-6 relative">
      <div className="grid grid-cols-7 gap-2">
        {/* Days of week headers */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-zinc-600 text-[10px] font-mono">{d}</div>
        ))}
        
        {/* Calendar Grid */}
        {[...Array(28)].map((_, i) => {
          const isWednesday = (i % 7) === 2; // Wednesdays
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={isWednesday ? { 
                scale: [1, 1.1, 1],
                backgroundColor: ["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 0.3)", "rgba(16, 185, 129, 0.1)"],
                borderColor: ["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.5)", "rgba(16, 185, 129, 0.2)"]
              } : {}}
              transition={isWednesday ? { 
                delay: (i / 7) * 0.5, // Stagger by week
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              } : {}}
              className={cn(
                "w-8 h-8 rounded border flex items-center justify-center text-xs",
                isWednesday 
                  ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" 
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-700"
              )}
            >
              {isWednesday && <CheckCircle2 size={12} />}
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 bg-zinc-800/80 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-700 flex items-center gap-2"
      >
        <Repeat size={12} className="text-emerald-400" />
        <span className="text-[10px] text-zinc-300 font-mono">Every Wednesday</span>
      </motion.div>
    </div>
  );
};

// --- Main Data ---

const useCases = [
  {
    id: "car",
    label: "Car Rental",
    icon: Car,
    description: "Individual booking with strict 1-unit capacity. Ideal for fleets, rentals, and equipment.",
    visual: CarRentalVisual,
    code: `// Scenario A: Book a specific Car
await createBooking({
  resourceId: "res_tesla_42",
  start: "2024-06-01T10:00:00Z",
  end: "2024-06-03T10:00:00Z",
  quantity: 1,
  metadata: {
    license: "ABC-123",
    insurance: "full"
  }
})`
  },
  {
    id: "health",
    label: "Healthcare",
    icon: Stethoscope,
    description: "Atomic group bookings. Reserve a Doctor and a Room simultaneously. If one fails, both fail.",
    visual: HealthcareVisual,
    code: `// Scenario B: Atomic Group Booking
await createGroupBooking({
  projectId: "proj_hospital_A",
  bookings: [
    {
      resourceId: "res_dr_smith",
      start: "2024-06-01T14:00:00Z",
      end: "2024-06-01T14:30:00Z",
      quantity: 1
    },
    {
      resourceId: "res_room_101",
      start: "2024-06-01T14:00:00Z",
      end: "2024-06-01T14:30:00Z",
      quantity: 1
    }
  ]
})`
  },
  {
    id: "course",
    label: "Digital Course",
    icon: Users,
    description: "High capacity resources. Manage webinars, events, or classes with automatic seat tracking.",
    visual: CourseVisual,
    code: `// Scenario C: High Capacity Event
await createBooking({
  resourceId: "res_webinar_01",
  start: "2024-06-10T18:00:00Z",
  end: "2024-06-10T20:00:00Z",
  quantity: 1, // Decrements capacity
  metadata: {
    studentId: "stud_99",
    email: "student@edu.com"
  }
})`
  },
  {
    id: "saas",
    label: "SaaS Platform",
    icon: Building2,
    description: "Multi-tenant architecture. Isolate customer data using Projects. One API, infinite tenants.",
    visual: SaasVisual,
    code: `// Scenario D: Multi-Tenant Setup

// 1. Create Tenant (Project)
const project = await createProject({
  name: "Salon A - NYC"
})
// -> Returns { apiKey: "sk_live_..." }

// 2. Use Tenant's API Key
const client = new DispoClient({
  apiKey: project.apiKey
})

await client.createResource({
  name: "Stylist Sarah"
})`
  },
  {
    id: "recurring",
    label: "Recurring Booking",
    icon: Repeat,
    description: "Create a series of bookings in one atomic request. Perfect for weekly meetings or monthly subscriptions.",
    visual: RecurringVisual,
    code: `// Scenario E: Recurring Meeting
await createRecurringBooking({
  resourceId: "res_room_b",
  start: "2024-02-01T10:00:00Z", // First slot start
  end: "2024-02-01T11:00:00Z",   // First slot end
  quantity: 1,
  recurrence: {
    frequency: "weekly",
    interval: 1,
    count: 10,
    byWeekDays: [3] // Wednesdays
  }
})
// -> Returns ["id_1", "id_2", ... "id_10"]`
  },
  {
    id: "availability",
    label: "Availability Check",
    icon: CalendarCheck,
    description: "Query availability for a specific range. Perfect for building calendars and scheduling UIs.",
    visual: AvailabilityVisual,
    code: `// Scenario F: Check Availability
const slots = await getAvailability({
  resourceId: "res_consultant_01",
  start: "2024-06-01T09:00:00Z",
  end: "2024-06-01T17:00:00Z",
  slotDurationMinutes: 60
})

// Output:
// [
//   { start: "...", end: "...", available: 5 },
//   { start: "...", end: "...", available: 2 },
//   ...
// ]`
  }
];

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(useCases[0]);

  return (
    <div className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">Built for any booking scenario</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            From atomic transactions to multi-tenant isolation, dispo.now adapts to your domain model.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Tabs */}
          <div className="lg:col-span-4 space-y-3">
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActiveTab(useCase)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 border group",
                  activeTab.id === useCase.id
                    ? "bg-zinc-800/50 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "bg-transparent border-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-colors",
                  activeTab.id === useCase.id 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-400"
                )}>
                  <useCase.icon size={20} />
                </div>
                <div>
                  <div className={cn("font-medium", activeTab.id === useCase.id ? "text-white" : "")}>
                    {useCase.label}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Content & Code */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full min-h-[500px]"
              >
                {/* Visual Section (Top/Left) */}
                <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/20 p-6 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                      <activeTab.icon className="text-emerald-500" size={20} />
                      {activeTab.label}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {activeTab.description}
                    </p>
                  </div>
                  
                  <div className="flex-1 min-h-[250px] relative">
                    <activeTab.visual />
                  </div>
                </div>

                {/* Code Section (Bottom/Right) */}
                <div className="md:w-1/2 bg-[#0d0d0d] flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">TypeScript</div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    </div>
                  </div>
                  <div className="p-6 overflow-x-auto flex-1 custom-scrollbar">
                    <pre className="font-mono text-xs sm:text-sm leading-relaxed text-zinc-300">
                      <code>
                        {activeTab.code.split('\n').map((line, i) => (
                          <div key={i} className="table-row">
                            <span className="table-cell text-zinc-700 select-none pr-4 text-right w-6 opacity-50">{i + 1}</span>
                            <span className="table-cell">
                              <span dangerouslySetInnerHTML={{__html: line
                                .replace(/"(.*?)"/g, '<span class="text-emerald-300">"$1"</span>')
                                .replace(/\b(await|const|new)\b/g, '<span class="text-purple-400">$1</span>')
                                .replace(/\b(createBooking|createGroupBooking|createProject|DispoClient)\b/g, '<span class="text-yellow-200">$1</span>')
                                .replace(/\b(resourceId|start|end|quantity|metadata|projectId|bookings|apiKey|name)\b/g, '<span class="text-sky-300">$1</span>')
                              }} />
                            </span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
