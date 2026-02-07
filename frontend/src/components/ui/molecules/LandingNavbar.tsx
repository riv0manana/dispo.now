import { Link } from "@tanstack/react-router";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/utils";

export function LandingNavbar() {
  const { t, i18n } = useTranslation();

  return (
    <m.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0F0F0F]/80 backdrop-blur-md z-50"
    >
      <div className="font-mono font-bold text-lg tracking-tight flex gap-2 items-center text-white">
        <img src="/logo.svg" alt="dispo.now" className="h-8 w-auto" />
        dispo.now
      </div>
      <div className="flex gap-4 text-sm font-medium text-zinc-400 items-center">
        <Link to="/docs" className="hover:text-white transition-colors">{t('nav.docs')}</Link>
        <a href="https://github.com/riv0manana/dispo.now" className="hover:text-white transition-colors">{t('nav.github')}</a>
        <Link to="/dashboard" className="text-white hover:underline decoration-emerald-500 underline-offset-4 ml-2">
          {t('nav.login')}
        </Link>
        
        {/* Language Switcher */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
          <button 
            onClick={() => i18n.changeLanguage('en')}
            className={cn(
              "text-xs font-mono transition-colors", 
              i18n.language === 'en' ? "text-emerald-400 font-bold" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            EN
          </button>
          <span className="text-zinc-800 text-xs">/</span>
          <button 
            onClick={() => i18n.changeLanguage('fr')}
            className={cn(
              "text-xs font-mono transition-colors", 
              i18n.language === 'fr' ? "text-emerald-400 font-bold" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            FR
          </button>
        </div>
      </div>
    </m.nav>
  );
}
