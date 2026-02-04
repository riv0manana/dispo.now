import { Link } from "@tanstack/react-router"
import { Check, Server } from "lucide-react"

const CompanySection = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready for <span className="text-emerald-400">Production</span>?
                    </h2>
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                        dispo.now is open source, but we offer a Commercial License for enterprises who need more.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-zinc-300">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check size={14} className="text-emerald-500" />
                            </div>
                            Priority Support & SLA
                        </li>
                        <li className="flex items-center gap-3 text-zinc-300">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check size={14} className="text-emerald-500" />
                            </div>
                            Audit Logs & SSO
                        </li>
                        <li className="flex items-center gap-3 text-zinc-300">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check size={14} className="text-emerald-500" />
                            </div>
                            Custom Feature Development
                        </li>
                    </ul>
                    <Link
                        to="mailto:contact@riv0manana.dev"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        Contact Sales
                    </Link>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                    <div className="relative p-8 rounded-2xl bg-zinc-900 border border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                                <Server size={24} className="text-zinc-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Enterprise Edition</h3>
                                <p className="text-sm text-zinc-500">Self-hosted with batteries included</p>
                            </div>
                        </div>
                        <div className="space-y-4 font-mono text-sm text-zinc-400">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>License</span>
                                <span className="text-white">Commercial</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Support</span>
                                <span className="text-white">24/7 Dedicated</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Deployment</span>
                                <span className="text-white">Custom VPC / On-Prem</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanySection