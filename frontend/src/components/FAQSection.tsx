import { m, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { Plus, Minus } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";

export function FAQSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Create a scroll progress listener for the long vertical line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  // Smooth out the progress
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  const pointTop = useTransform(pathLength, val => `${val * 100}%`);

  const faqs = t("faq.items", { returnObjects: true }) as Array<{
    id: string;
    question: string;
    answer: string;
  }>;

  return (
    <section ref={containerRef} className="py-16 md:py-20 px-6 relative overflow-hidden bg-[#09090b]">
       {/* Background Grid */}
       <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
        }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {t("faq.title")}
            </h2>
        </div>

        {isMobile ? (
            // Mobile: Collapsible Stack
            <div className="space-y-4">
                {faqs.map((faq) => (
                    <MobileFAQItem key={faq.id} faq={faq} />
                ))}
            </div>
        ) : (
            // Desktop: Animated Timeline
            <div className="relative grid grid-cols-[1fr_4px_1fr] gap-x-8 gap-y-8">
                
                {/* Center Animated Line */}
                <div 
                    className="flex justify-center relative h-full col-start-2 row-start-1"
                    style={{ gridRowEnd: faqs.length + 1 }}
                >
                    {/* Static Track */}
                    <div className="w-[2px] h-full bg-zinc-800 absolute top-0" />
                    
                    {/* Animated Fill */}
                    <m.div 
                        style={{ scaleY: pathLength, originY: 0 }}
                        className="w-[2px] h-full bg-gradient-to-b from-emerald-500 via-emerald-400 to-transparent absolute top-0"
                    />

                    {/* Animated Moving Point */}
                    <m.div 
                        style={{ top: pointTop }}
                        className="absolute w-4 h-4 rounded-full bg-emerald-500 border-4 border-black shadow-[0_0_20px_rgba(16,185,129,0.5)] -translate-x-[1px] -translate-y-2 z-10"
                    />
                </div>

                {/* Questions */}
                {faqs.map((faq, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                        <div 
                            key={faq.id} 
                            className={cn(
                                "flex items-center", 
                                isLeft ? "justify-end col-start-1" : "justify-start col-start-3"
                            )}
                            style={{ gridRow: i + 1 }}
                        >
                            <DesktopFAQItem 
                                faq={faq} 
                                align={isLeft ? "right" : "left"} 
                                index={i} 
                            />
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </section>
  );
}

function DesktopFAQItem({ faq, align }: { faq: { id: string, question: string, answer: string }, align: 'left' | 'right', index: number }) {
    return (
        <m.div
            initial={{ opacity: 0, x: align === 'left' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
                "relative group w-full max-w-lg p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors",
                align === 'right' ? "text-right" : "text-left"
            )}
        >
            {/* Connector Dot to Center Line */}
            <div className={cn(
                "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 transition-colors group-hover:bg-emerald-500 group-hover:border-emerald-400 z-10",
                align === 'right' ? "-right-[38px]" : "-left-[38px]"
            )} />
            
            {/* Connector Line */}
            <div className={cn(
                "absolute top-1/2 -translate-y-1/2 h-[1px] w-[34px] bg-zinc-800 group-hover:bg-emerald-500/30 transition-colors",
                align === 'right' ? "-right-[34px]" : "-left-[34px]"
            )} />

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {faq.question}
            </h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
                {faq.answer}
            </p>
        </m.div>
    )
}

function MobileFAQItem({ faq }: { faq: { id: string, question: string, answer: string } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left text-white font-medium hover:bg-zinc-800/50 transition-colors"
            >
                <span className={cn("pr-4", isOpen ? "text-emerald-400" : "")}>{faq.question}</span>
                {isOpen ? <Minus size={16} className="text-emerald-400 shrink-0" /> : <Plus size={16} className="text-zinc-500 shrink-0" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50 mt-2">
                            {faq.answer}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    )
}
