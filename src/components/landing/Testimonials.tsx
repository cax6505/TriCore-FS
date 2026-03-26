import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export const Testimonials = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-10">
                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span
                        className="inline-flex items-center gap-2 text-[11px] font-bold text-black uppercase mb-5"
                        style={{ letterSpacing: "1.5px" }}
                    >
                        <span className="w-[6px] h-[6px] bg-black inline-block" />
                        SEE IT IN ACTION
                    </span>
                </motion.div>

                {}
                <div className="flex flex-col lg:flex-row gap-10 max-w-[1400px] mx-auto">
                    {}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 flex flex-col"
                    >
                        <div
                            className="relative overflow-hidden flex-1 w-full h-full min-h-[350px]"
                            style={{ backgroundColor: "#0f172a" }}
                        >
                            {/* Video Background */}
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source
                                    src="/assets/SaveSpace%20AI%20Agents%20for%20Document%20OCR%20Workflows.webm"
                                    type="video/webm"
                                />
                            </video>

                            {/* Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent z-10" />

                            <div className="absolute top-4 right-4 z-20 bg-black/45 text-white text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 border border-white/25">
                                Autoplay Preview
                            </div>

                            {/* Bottom Text Over Video */}
                            <div className="absolute bottom-4 left-4 z-20 text-white">
                                <p className="text-[14px] font-medium">Watch SaveSpace in Action</p>
                                <p className="text-[12px] text-white/70">
                                    File organization & system visualization demo
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="flex-1 flex flex-col justify-center"
                    >
                        <div className="bg-[#f8fafc] border border-gray-200 p-8 sm:p-10 h-full flex flex-col justify-between">
                            {}
                            <div className="mb-8">
                                <span className="text-[22px] font-medium tracking-tight text-black flex items-center gap-3">
                                    <BookOpen className="w-6 h-6" />
                                    What You'll Learn
                                </span>
                            </div>

                            {}
                            <div className="flex-1 mb-8 space-y-4">
                                {[
                                    {
                                        title: "Contiguous Allocation",
                                        desc: "Files stored in adjacent blocks — fast sequential access but suffers from external fragmentation.",
                                    },
                                    {
                                        title: "Linked Allocation",
                                        desc: "Blocks scattered anywhere, connected by pointers — eliminates external fragmentation but slow random access.",
                                    },
                                    {
                                        title: "Indexed Allocation",
                                        desc: "An index block stores pointers to all data blocks — efficient direct access with index overhead.",
                                    },
                                    {
                                        title: "Unix Inode (Multi-level)",
                                        desc: "Direct pointers for small files, indirect for large — the scalable, real-world standard.",
                                    },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <h4 className="text-[16px] font-semibold text-black mb-1">{item.title}</h4>
                                        <p className="text-[14px] text-gray-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {}
                            <div>
                                <p className="text-[13px] text-gray-500 italic">
                                    "The difference between a good programmer and a great one is understanding what happens beneath the abstractions."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
