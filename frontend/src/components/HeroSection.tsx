import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Server } from "lucide-react";

const HeroSection = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    return (
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                <motion.div
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    className="space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono mb-8 hover:border-emerald-500/50 transition-colors cursor-pointer"
                    >
                        <Server size={12} />
                        <span>Open Source & Self-Hosted</span>
                    </motion.div>
                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                    >
                        The Booking <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Infrastructure.
                        </span>
                    </motion.h1>

                    <motion.div variants={fadeInUp} className="text-xl text-zinc-400 max-w-lg leading-relaxed space-y-4">
                        <p className="text-white font-medium text-2xl">
                            Stop rebuilding booking logic. <br />Start shipping your product.
                        </p>
                        <p>
                            We handle the complex logic of availability, capacity, and concurrency so you can focus on your User Experience.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            to="/docs"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Read the Docs <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 bg-zinc-900/50 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            Get API Key
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Code Snippet */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative rounded-xl border border-white/10 bg-[#161616] shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>
                            <div className="text-xs font-mono text-zinc-500">client.ts</div>
                            <div className="w-10"></div>
                        </div>
                        <div className="p-6 overflow-x-auto bg-[#0d0d0d]">
                            <pre className="font-mono text-sm leading-relaxed">
                                <code className="language-typescript">
                                    <span className="text-purple-400">await</span> <span className="text-blue-400">createBooking</span><span className="text-zinc-300">({`{`}</span>{'\n'}
                                    <span className="text-zinc-500">  // The resource you want to book</span>{'\n'}
                                    <span className="text-zinc-300">  </span><span className="text-sky-300">resourceId</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"room-a"</span><span className="text-zinc-300">,</span>{'\n'}
                                    <span className="text-zinc-300">  </span><span className="text-sky-300">start</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"2026-02-01T10:00:00Z"</span><span className="text-zinc-300">,</span>{'\n'}
                                    <span className="text-zinc-300">  </span><span className="text-sky-300">end</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"2026-02-01T11:00:00Z"</span><span className="text-zinc-300">,</span>{'\n'}
                                    <span className="text-zinc-300">  </span><span className="text-sky-300">quantity</span><span className="text-zinc-300">: </span><span className="text-orange-300">1</span>{'\n'}
                                    <span className="text-zinc-300">{`}`}</span><span className="text-zinc-300">)</span>
                                </code>
                            </pre>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}

export default HeroSection