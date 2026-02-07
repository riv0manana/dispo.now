import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "../../../lib/utils";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-50 p-3 rounded-full bg-zinc-800/80 border border-zinc-700 text-white backdrop-blur-sm shadow-lg hover:bg-zinc-700 hover:border-emerald-500/50 hover:text-emerald-400 transition-all",
            "flex items-center justify-center"
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </m.button>
      )}
    </AnimatePresence>
  );
}
