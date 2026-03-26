import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const UnlockSection = () => {
    return (
        <section className="relative py-32 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden">
            {}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                {}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6"
                >
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold text-purple-600 uppercase tracking-[0.2em] mb-6 px-4 py-2 bg-purple-50 rounded-full">
                        <Sparkles className="w-3.5 h-3.5" />
                        Open Source
                    </span>
                    <h2 className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] font-bold text-slate-900 tracking-tight leading-[1.05] mb-6">
                        Unlock the next level
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
                        Built on a battle-tested open-source core. SaveSpace
                        provides the complete framework for connecting your data
                        to LLMs — from ingestion to deployment.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <Link to="/visualization">
                            <Button className="bg-slate-900 text-white hover:bg-black text-[12px] font-bold uppercase tracking-widest px-8 py-4 h-auto rounded-md shadow-lg shadow-slate-900/10 transition-all hover:translate-y-[-2px]">
                                Explore Framework
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <a href="https://github.com/run-llama/llama_index" target="_blank" rel="noopener noreferrer">
                            <button className="text-[12px] font-bold text-slate-700 uppercase tracking-widest border border-slate-200 bg-white px-8 py-4 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all">
                                View on GitHub
                            </button>
                        </a>
                    </div>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="relative max-w-5xl mx-auto"
                >
                    {}
                    <div className="absolute -inset-8 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 rounded-[40px] blur-3xl opacity-40" />

                    <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden p-3">
                        <img
                            src="/assets/imgi_28_b56f30bb1df5c39ff007ec16c9af133d629148a6-1616x1616.png"
                            alt="SaveSpace Core Framework — data ingestion, indexing, retrieval, and agentic workflows"
                            className="w-full h-auto rounded-xl"
                            loading="lazy"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
