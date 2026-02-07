import { m } from "framer-motion";
import { CreditCard, Database, Lock, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";
import { useState, useEffect } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

export function ArchitectureFlowIllustration() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Cycle through active states to simulate a real-time request flow
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full my-12">
      <div className="relative w-full max-w-5xl mx-auto h-[700px] md:h-[600px] flex items-center justify-center perspective-1000">
      
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', 
              backgroundSize: '40px 40px' 
          }}
        />

        {/* Central Orchestrator: The User's App */}
        {/* Mobile: Top-Center (below Auth). Desktop: Center */}
        <div className={cn(
          "absolute z-20 transition-all duration-500",
          isMobile 
            ? "top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2" 
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        )}>
          <CentralHub activeStep={activeStep} label={t("workflow.nodes.app")} isMobile={isMobile} />
        </div>

        {/* Satellite: Auth (Top) */}
        <ServiceNode 
          icon={<Lock className="w-5 h-5 text-blue-400" />}
          label="Auth"
          sub="Clerk / Auth0"
          color="blue"
          position={isMobile ? "mobile-top" : "top"}
          isActive={activeStep === 0}
          delay={0}
          isMobile={isMobile}
        />

        {/* Satellite: Database (Bottom) */}
        <ServiceNode 
          icon={<Database className="w-5 h-5 text-indigo-400" />}
          label="Database"
          sub="Postgres"
          color="indigo"
          position={isMobile ? "mobile-bottom" : "bottom"}
          isActive={activeStep === 3}
          delay={0.2}
          isMobile={isMobile}
        />

        {/* Satellite: Payments (Left / Mobile: Left-Center) */}
        <ServiceNode 
          icon={<CreditCard className="w-5 h-5 text-purple-400" />}
          label="Payments"
          sub="Stripe"
          color="purple"
          position={isMobile ? "mobile-left" : "left"}
          isActive={activeStep === 2}
          delay={0.4}
          isMobile={isMobile}
        />

        {/* Satellite: Booking (Right / Mobile: Right-Center) - HERO */}
        <ServiceNode 
          icon={<img src="/logo.svg" alt="dispo.now" className="w-6 h-6" />}
          label="Booking Engine"
          sub="dispo.now"
          color="emerald"
          position={isMobile ? "mobile-right" : "right"}
          isActive={activeStep === 1}
          isHero={true}
          delay={0.6}
          isMobile={isMobile}
        />

        {/* Connecting Lines & Data Packets */}
        <Connections activeStep={activeStep} isMobile={isMobile} />
      </div>

      {/* Stack References Footer - Moved outside the illustration container */}
      <div className="mt-20 flex flex-wrap gap-4 md:gap-8 items-center justify-center text-xs md:text-sm font-mono text-zinc-600 opacity-60 relative z-20">
         <span className="flex items-center gap-2">
            <Lock size={12} /> Clerk
         </span>
         <span className="flex items-center gap-2">
            <CreditCard size={12} /> Stripe
         </span>
         <span className="flex items-center gap-2">
            <Database size={12} /> PostgreSQL
         </span>
         <span className="flex items-center gap-2 text-emerald-600 font-bold">
            <img src="/logo.svg" className="w-3 h-3 grayscale opacity-50" /> dispo.now
         </span>
      </div>
    </div>
  );
}

function CentralHub({ activeStep, label, isMobile }: { activeStep: number, label: string, isMobile: boolean }) {
  const size = isMobile ? "w-32 h-32" : "w-48 h-48";
  const innerSize = isMobile ? "w-20 h-20" : "w-32 h-32";

  return (
    <m.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative group"
    >
      {/* Outer Rings */}
      <div className="absolute inset-0 bg-zinc-800/50 rounded-full blur-xl group-hover:bg-zinc-700/50 transition-colors duration-500" />
      <div className={cn("bg-[#0a0a0a] border border-zinc-800 rounded-full flex flex-col items-center justify-center relative shadow-2xl z-10 transition-all duration-500", size)}>
        
        {/* Inner Tech Circle */}
        <div className={cn("rounded-full border border-zinc-800/50 flex items-center justify-center bg-zinc-900/50 relative overflow-hidden transition-all duration-500", innerSize)}>
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
           <Monitor className={cn("text-white relative z-10", isMobile ? "w-6 h-6" : "w-10 h-10")} />
           
           {/* Scanning Effect */}
           <m.div 
             animate={{ top: ['-100%', '200%'] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent w-full"
           />
        </div>

        {/* Status Indicators */}
        <div className="absolute -bottom-6 flex gap-2">
            {[0, 1, 2, 3].map(i => (
                <m.div 
                    key={i}
                    animate={{ 
                        backgroundColor: activeStep === i ? '#10B981' : '#27272A',
                        scale: activeStep === i ? 1.2 : 1
                    }}
                    className="w-2 h-2 rounded-full transition-colors duration-300"
                />
            ))}
        </div>

        <div className={cn("absolute text-center w-64", isMobile ? "-top-8" : "-top-10")}>
            <h3 className={cn("font-bold text-white tracking-tight", isMobile ? "text-sm" : "text-xl")}>{label}</h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">Orchestrator</p>
        </div>
      </div>
    </m.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ServiceNode({ icon, label, sub, color, position, isActive, isHero = false, delay, isMobile }: any) {
  const positions = {
    // Desktop
    top: "top-0 left-1/2 -translate-x-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2",
    left: "left-0 top-1/2 -translate-y-1/2",
    right: "right-0 top-1/2 -translate-y-1/2",
    
    // Mobile (Vertical Flow with Branches)
    "mobile-top": "top-0 left-1/2 -translate-x-1/2", // Auth
    "mobile-bottom": "bottom-0 left-1/2 -translate-x-1/2", // DB
    "mobile-left": "top-[60%] left-4", // Payment
    "mobile-right": "top-[60%] right-4", // Booking
  };

  const colors = {
    blue: "border-blue-500/30 bg-blue-500/5 shadow-blue-500/20",
    indigo: "border-indigo-500/30 bg-indigo-500/5 shadow-indigo-500/20",
    purple: "border-purple-500/30 bg-purple-500/5 shadow-purple-500/20",
    emerald: "border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/30"
  };

  const textColors = {
    blue: "text-blue-400",
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400"
  };
  
  const widthClass = isMobile ? (isHero ? "w-40" : "w-32") : (isHero ? "w-64" : "w-48");
  const paddingClass = isMobile ? "p-3" : "p-6";

  return (
    <m.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
          "absolute flex flex-col items-center gap-4 z-10", 
          positions[position as keyof typeof positions]
      )}
    >
      <div className={cn(
          "relative rounded-2xl border backdrop-blur-md transition-all duration-500",
          colors[color as keyof typeof colors],
          isActive ? "scale-110 ring-2 ring-offset-2 ring-offset-black " + (isHero ? "ring-emerald-500" : `ring-${color}-500`) : "opacity-70 grayscale-[0.5]",
          widthClass,
          paddingClass
      )}>
        {isActive && (
            <m.div 
                layoutId="active-glow"
                className={cn("absolute inset-0 rounded-2xl bg-gradient-to-tr opacity-20", 
                    color === 'emerald' ? 'from-emerald-500 to-white' : `from-${color}-500 to-transparent`
                )} 
            />
        )}
        
        <div className={cn("flex items-center relative z-10", isMobile ? "flex-col text-center gap-2" : "gap-4")}>
            <div className={cn("rounded-xl bg-black/50 border border-white/10", textColors[color as keyof typeof textColors], isMobile ? "p-2" : "p-3")}>
                {icon}
            </div>
            <div>
                <div className={cn("font-bold uppercase tracking-wider mb-0.5", textColors[color as keyof typeof textColors], isMobile ? "text-[10px]" : "text-xs")}>
                    {label}
                </div>
                <div className={cn("text-zinc-200 font-medium whitespace-nowrap", isMobile ? "text-xs" : "text-sm")}>
                    {sub}
                </div>
            </div>
        </div>

        {/* Floating Action Badge */}
        {!isMobile && (
          <m.div 
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? -10 : 0 }}
              className={cn(
                  "absolute -top-3 right-4 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-black",
                  textColors[color as keyof typeof textColors],
                  `border-${color}-500/30`
              )}
          >
              Active
          </m.div>
        )}
      </div>
    </m.div>
  );
}

function Connections({ activeStep, isMobile }: { activeStep: number, isMobile: boolean }) {
  // Mobile paths (Vertical Flow)
  // App is at 50% 30%
  // Auth is at 50% 0%
  // Payment is at 10% 60%
  // Booking is at 90% 60%
  // DB is at 50% 100%
  
  // Note: SVG coordinates are 0-1000 width, 0-600 height (Desktop) or 0-800 height (Mobile?)
  // We use the same viewbox 1000x600 for simplicity, but map visual positions
  
  // Mobile Layout Mapping in 1000x600 space:
  // Auth: 500, 50
  // App: 500, 200 (approx 30%) -> Now 25% (approx 150-180)
  // Payment: 150, 400 (approx 60%)
  // Booking: 850, 400 (approx 60%)
  // DB: 500, 550
  
  const paths = isMobile ? {
    auth: "M 500 80 L 500 130",
    booking: "M 500 200 L 800 380",
    payment: "M 500 200 L 200 380",
    db: "M 500 200 L 500 520" // Long line down
  } : {
    auth: "M 500 100 L 500 200",
    booking: "M 600 300 L 750 300",
    payment: "M 400 300 L 250 300",
    db: "M 500 400 L 500 500"
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio={isMobile ? "none" : "xMidYMid meet"}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#52525b" />
          </marker>
        </defs>

        {/* Top Line (Auth -> App) */}
        <ConnectionPath 
            id="auth-flow"
            d={paths.auth}
            isActive={activeStep === 0} 
            color="#60A5FA" 
            label="1. Validate"
            isMobile={isMobile}
        />
        
        {/* Right Line (App -> Booking) */}
        <ConnectionPath 
            id="booking-flow"
            d={paths.booking} 
            isActive={activeStep === 1} 
            color="#34D399" 
            label="2. Book"
            isMobile={isMobile}
        />

        {/* Left Line (App -> Payment) */}
        <ConnectionPath 
            id="payment-flow"
            d={paths.payment} 
            isActive={activeStep === 2} 
            color="#A78BFA" 
            label="3. Charge"
            isMobile={isMobile}
        />

        {/* Bottom Line (App -> DB) */}
        <ConnectionPath 
            id="db-flow"
            d={paths.db}
            isActive={activeStep === 3} 
            color="#818CF8" 
            label="4. Persist"
            isMobile={isMobile}
        />
      </svg>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ConnectionPath({ d, isActive, color, label, isMobile }: any) {
  return (
    <>
      {/* Background Track */}
      <path 
        d={d} 
        stroke="#333" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        fill="none"
      />
      
      {/* Active Beam */}
      {isActive && (
        <m.path 
          d={d}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          fill="none"
          filter={`drop-shadow(0 0 8px ${color})`}
        />
      )}

      {/* Floating Label Badge */}
      {isActive && (
          <foreignObject 
            x={getMidpoint(d).x - (isMobile ? 40 : 60)} 
            y={getMidpoint(d).y - 12} 
            width={isMobile ? "80" : "120"} 
            height="24"
          >
              <m.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center"
              >
                  <span 
                    className={cn(
                      "px-2 py-0.5 font-mono font-bold uppercase rounded-full bg-[#09090b] border shadow-lg whitespace-nowrap",
                      isMobile ? "text-[8px]" : "text-[10px]"
                    )}
                    style={{ borderColor: color, color: color }}
                  >
                    {label}
                  </span>
              </m.div>
          </foreignObject>
      )}
    </>
  );
}

// Helper to find midpoint of simple linear paths
function getMidpoint(d: string) {
    const parts = d.split(' ');
    // Simple parser for M x y L x y
    const x1 = parseFloat(parts[1]);
    const y1 = parseFloat(parts[2]);
    const x2 = parseFloat(parts[4]);
    const y2 = parseFloat(parts[5]);
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}
