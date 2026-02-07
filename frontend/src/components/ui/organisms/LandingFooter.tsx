import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/5 py-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="font-mono font-bold text-lg tracking-tight mb-4 flex gap-2 items-center text-white">
            <img src="/logo.svg" alt="dispo.now" className="h-8 w-auto" />
            dispo.now
          </div>
          <p className="text-zinc-500 text-sm max-w-xs">
            {t('footer.tagline')}
            <br />
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white">{t('footer.product.title')}</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link to="/docs" className="hover:text-white">{t('footer.product.docs')}</Link></li>
            <li><a href="/ui" className="hover:text-white">{t('footer.product.api')}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white">{t('footer.company.title')}</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="https://riv0manana.dev" className="hover:text-white">{t('footer.company.website')}</a></li>
            <li><a href="https://github.com/riv0manana/dispo.now" className="hover:text-white">{t('footer.company.github')}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
