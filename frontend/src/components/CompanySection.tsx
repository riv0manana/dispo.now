import { Check, Server } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

const CompanySection = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        <Trans i18nKey="company.title" components={{ 1: <span className="text-emerald-400" /> }} />
                    </h2>
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                        {t('company.description')}
                    </p>
                    <ul className="space-y-4 mb-8">
                        {(t('company.features', { returnObjects: true }) as string[]).map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-zinc-300">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <Check size={14} className="text-emerald-500" />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                    <div className="relative p-8 rounded-2xl bg-zinc-900 border border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                                <Server size={24} className="text-zinc-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{t('company.enterprise.title')}</h3>
                                <p className="text-sm text-zinc-500">{t('company.enterprise.subtitle')}</p>
                            </div>
                        </div>
                        <div className="space-y-4 font-mono text-sm text-zinc-400">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>{t('company.enterprise.license')}</span>
                                <span className="text-white">{t('company.enterprise.commercial')}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>{t('company.enterprise.support')}</span>
                                <span className="text-white">{t('company.enterprise.dedicated')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('company.enterprise.deployment')}</span>
                                <span className="text-white">{t('company.enterprise.custom')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanySection