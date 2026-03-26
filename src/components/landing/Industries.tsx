import { motion } from "framer-motion";
import { FolderOpen, Layers, HardDrive, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
    {
        name: "Smart Sorting",
        icon: <FolderOpen className="w-6 h-6" />,
        desc: "Upload a messy folder and auto-organize every file by type — mp3, mp4, png, pdf, docx, and dozens more extensions sorted into clean categories.",
        cta: "TRY ORGANIZER",
        link: "/finder",
        color: "#67e8f9",
        bgGradient: "linear-gradient(135deg, #67e8f9 0%, #22d3ee 40%, #06b6d4 100%)",
    },
    {
        name: "Allocation Strategies",
        icon: <Layers className="w-6 h-6" />,
        desc: "Learn Contiguous, Linked, Indexed, and Unix Inode multi-level strategies with interactive animations. See how each approach allocates disk blocks differently.",
        cta: "EXPLORE STRATEGIES",
        link: "/visualization",
        color: "#a5b4fc",
        bgGradient: "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 40%, #818cf8 100%)",
    },
    {
        name: "Disk Visualization",
        icon: <HardDrive className="w-6 h-6" />,
        desc: "See exactly how files occupy disk blocks with real-time color-coded visual feedback. Create, delete, and resize files to watch the disk state change live.",
        cta: "VIEW SIMULATOR",
        link: "/visualization",
        color: "#fbbf24",
        bgGradient: "linear-gradient(135deg, #fcd34d 0%, #fbbf24 40%, #f59e0b 100%)",
    },
    {
        name: "Fragmentation Analysis",
        icon: <BarChart3 className="w-6 h-6" />,
        desc: "Understand how fragmentation builds up over time and how different allocation strategies handle it. Track fragmentation percentage in real time as you create and delete files.",
        cta: "ANALYZE NOW",
        link: "/visualization",
        color: "#f9a8d4",
        bgGradient: "linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 40%, #f472b6 100%)",
    },
];

export const Industries = () => {
    return (
        <section className="py-20 bg-[#f8fafc] relative overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="bg-white flex flex-col justify-between relative overflow-hidden group cursor-pointer border border-gray-200"
                            style={{ minHeight: "320px" }}
                        >
                            {}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px]"
                                style={{ background: feature.bgGradient }}
                            />
                            <div className="p-8 xl:pr-52">
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="w-10 h-10 flex items-center justify-center text-black"
                                        style={{ border: "1px solid #d1d5db" }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 style={{ fontSize: "24px", fontWeight: 500, letterSpacing: "-0.48px", color: "#000" }}>
                                        {feature.name}
                                    </h3>
                                </div>

                                {}
                                <p className="text-[15px] text-gray-700 leading-[1.65] max-w-[360px] mb-6">
                                    {feature.desc}
                                </p>

                                {}
                                <Link to={feature.link}>
                                    <button
                                        className="text-[12px] font-medium text-black uppercase bg-white hover:bg-gray-50 transition-all"
                                        style={{
                                            letterSpacing: "1.5px",
                                            border: "1px solid #d1d5db",
                                            padding: "10px 20px",
                                        }}
                                    >
                                        {feature.cta}
                                    </button>
                                </Link>
                            </div>

                            {}
                            <div
                                className="hidden xl:block absolute top-4 right-4 bottom-4"
                                style={{
                                    width: "180px",
                                    background: feature.bgGradient,
                                    opacity: 0.9,
                                }}
                            >
                                {}
                                <div className="absolute inset-4 flex items-center justify-center">
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            border: `3px solid rgba(255,255,255,0.3)`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "70%",
                                                height: "70%",
                                                border: `3px solid rgba(255,255,255,0.25)`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "60%",
                                                    height: "60%",
                                                    border: `3px solid rgba(255,255,255,0.2)`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
