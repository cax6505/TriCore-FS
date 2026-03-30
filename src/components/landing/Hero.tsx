import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    BrickWall,
    ChartNoAxesColumnIncreasing,
    FolderTree,
    GraduationCap,
    HardDrive,
    MonitorCog,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
    return (
        <section className="relative w-full pt-24 sm:pt-28 pb-0 overflow-visible bg-white">

            <div className="px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start mb-10 lg:mb-14 max-w-[1400px] mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: "1.05", color: "#000" }}>
                            Organize your files.
                            <br />
                            Understand
                            <br />
                            your OS.
                        </h1>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col justify-end lg:pt-1 lg:ml-auto"
                    >
                        <p
                            style={{
                                fontSize: "19px",
                                fontWeight: 400,
                                lineHeight: "1.4",
                                letterSpacing: "0",
                                color: "#000",
                            }}
                            className="mb-8"
                        >
                            SaveSpace helps you instantly organize
                            <br />
                            messy folders by file type — and learn
                            <br />
                            how operating systems manage files
                            <br />
                            under the hood with interactive visualizations.
                        </p>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://github.com/cax6505/TriCore-FS"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button
                                    className="text-[12px] font-medium text-black uppercase bg-white hover:bg-gray-50 transition-all inline-flex items-center justify-center cursor-pointer tracking-[0.08em]"
                                    style={{
                                        border: "1px solid #e0e0e0",
                                        padding: "0 18px",
                                        height: "36px",
                                    }}
                                >
                                    View on GitHub
                                </button>
                            </a>
                            <Link to="/visualization">
                                <Button
                                    className="text-[12px] font-medium text-white uppercase bg-black hover:bg-gray-900 transition-all tracking-[0.08em]"
                                    style={{
                                        border: "1px solid black",
                                        padding: "0 18px",
                                        height: "36px",
                                    }}
                                >
                                    Launch App
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>


            <div className="relative w-full">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to right, #7dd3fc, #a5b4fc, #c084fc, #f0abfc, #fda4af)",
                    }}
                />
                <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white to-transparent z-[1]" />

                <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="relative w-full max-w-4xl"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto relative z-10"
                        >
                            <source
                                src="/assets/SaveSpace%20AI%20Agents%20for%20Document%20OCR%20Workflows.webm"
                                type="video/webm"
                            />
                        </video>
                    </motion.div>
                </div>


                <div className="relative z-10 pt-8 pb-6">
                    <div className="mx-4 sm:mx-6 lg:mx-10 border-y border-black/10 py-5">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="flex justify-center items-center gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-3 px-1 flex-wrap">
                        {[
                            { label: "Smart File Sorting", icon: FolderTree },
                            { label: "Allocation Strategies", icon: BrickWall },
                            { label: "Disk Visualization", icon: HardDrive },
                            { label: "Fragmentation Analysis", icon: ChartNoAxesColumnIncreasing },
                            { label: "macOS Finder UI", icon: MonitorCog },
                            { label: "Interactive Learning", icon: GraduationCap },
                        ].map((item, i) => (
                            <span
                                key={i}
                                className="text-black text-[15px] sm:text-[16px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors hover:text-black/80 flex items-center gap-2 py-1 leading-[1.35]"
                            >
                                <item.icon className="w-[17px] h-[17px] text-black/85 shrink-0" strokeWidth={2} />
                                {item.label}
                            </span>
                        ))}
                    </div>
                        </div>
                    </div>
                </div>
            </div>


            <div
                className="relative w-full py-10 sm:py-12"
                style={{
                    background: "linear-gradient(to bottom, #f0abfc, #fdba74, #fef3c7, white)",
                }}
            >
                <div className="px-4 sm:px-6 lg:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] max-w-[1400px] w-full mx-auto px-5 py-6 md:px-8 md:py-8 xl:px-10 xl:py-9"
                        style={{ border: "1px solid #e5e7eb" }}
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-7 xl:gap-8 items-start xl:items-center">
                            <div className="xl:col-span-4">
                                <h3
                                    style={{
                                        fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)",
                                        fontWeight: 500,
                                        letterSpacing: "-0.02em",
                                        lineHeight: "1.22",
                                        color: "#000",
                                    }}
                                >
                                    Completely
                                    <br />
                                    <span className="inline-block pr-[0.08em] pb-[0.02em] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 italic">
                                        free & open source
                                    </span>
                                </h3>
                            </div>

                            <div className="xl:col-span-6 pl-1 sm:pl-2 xl:pl-4">
                                <p className="text-[16px] font-semibold text-gray-800 mb-3">
                                    What's included:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-[16px] text-gray-700 leading-[1.6]">
                                    <li>Smart file organizer with macOS Finder-style interface</li>
                                    <li>Interactive OS file system allocation strategy simulator</li>
                                    <li>Real-time disk block visualization and fragmentation analysis</li>
                                    <li>Educational tool for OS concepts, perfect for students</li>
                                </ul>
                            </div>

                            <div className="xl:col-span-2 xl:justify-self-end">
                                <Link to="/visualization">
                                    <Button
                                        className="text-[13px] font-medium text-white uppercase bg-black hover:bg-gray-900 transition-all whitespace-nowrap w-full xl:w-auto"
                                        style={{
                                            letterSpacing: "0.48px",
                                            border: "1px solid black",
                                            padding: "10px 26px",
                                            height: "44px",
                                        }}
                                    >
                                        Launch App
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
