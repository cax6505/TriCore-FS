import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Features = () => {
    return (
        <section className="relative w-full py-32 bg-white overflow-hidden">
            <div style={{ margin: "0 40px" }}>
                {}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6 max-w-6xl mx-auto"
                >
                    <span
                        className="inline-flex items-center gap-2 text-[11px] font-bold text-black uppercase mb-6"
                        style={{ letterSpacing: "1.5px" }}
                    >
                        <span className="w-[6px] h-[6px] bg-black inline-block" />
                        PLATFORM
                    </span>
                    <h2
                        style={{
                            fontSize: "clamp(2rem, 4vw, 3.5rem)",
                            fontWeight: 500,
                            letterSpacing: "-1.5px",
                            lineHeight: "1.1",
                            color: "#000",
                            marginBottom: "20px",
                        }}
                    >
                        Connecting data to
                        <br />
                        intelligent computation
                    </h2>
                    <p className="text-[15px] text-gray-500 max-w-xl mx-auto leading-[1.7]">
                        A full-stack platform for building production-ready LLM
                        applications — from parsing to retrieval to agentic
                        workflows.
                    </p>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-6xl mx-auto mb-16"
                >
                    {[
                        {
                            title: "Parse",
                            desc: "World-leading document parsing with SaveParse. Handle PDFs, images, tables, and complex layouts.",
                            topColor: "#3b82f6",
                        },
                        {
                            title: "Index",
                            desc: "Vector, keyword, and knowledge graph indexing for optimal retrieval across any data source.",
                            topColor: "#8b5cf6",
                        },
                        {
                            title: "Query",
                            desc: "Advanced retrieval with hybrid search, reranking, and agentic query routing.",
                            topColor: "#ec4899",
                        },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className="group relative bg-white p-8 cursor-pointer"
                            style={{
                                borderTop: `2px solid ${card.topColor}`,
                                borderRight: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
                            }}
                        >
                            {}
                            <span
                                className="text-[12px] font-bold uppercase mb-4 block"
                                style={{ letterSpacing: "1.5px", color: card.topColor }}
                            >
                                0{i + 1}
                            </span>
                            <h3
                                className="text-[26px] font-medium text-black mb-3"
                                style={{ letterSpacing: "-0.4px" }}
                            >
                                {card.title}
                            </h3>
                            <p className="text-[16px] text-gray-600 leading-[1.65] mb-6">
                                {card.desc}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-black uppercase group-hover:gap-3 transition-all" style={{ letterSpacing: "1px" }}>
                                Learn more
                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    ))}
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="relative max-w-6xl mx-auto"
                >
                    <div className="relative bg-white overflow-hidden" style={{ border: "1px solid #e7e7e7" }}>
                        <img
                            src="/assets/imgi_26_0e1dbadf7d3a3c73a1bf607226e2576f56f56453-1616x1360.png"
                            alt="SaveSpace — Documents to 3D embeddings and intelligent indexing"
                            className="w-full h-auto"
                            loading="lazy"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
