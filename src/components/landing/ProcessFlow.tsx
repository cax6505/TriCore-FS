import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";


interface FeatureData {
    number: string;
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
    buttonLink: string;
    bullets: { title: string; desc: string }[];
    glow?: boolean;
    blendMultiply?: boolean;
}

const features: FeatureData[] = [
    {
        number: "01",
        title: "Smart File Organizer",
        description:
            "A macOS Finder-inspired interface where you upload any folder and click 'Organize' — files are automatically sorted by extension into clean categories like Images, Videos, Documents, Music, and more.",
        image: "/assets/upload_drop image.png",
        buttonLabel: "TRY ORGANIZER",
        buttonLink: "/finder",
        bullets: [
            {
                title: "Upload & Drop",
                desc: "Drag any folder into the interface or use the upload button to load your files instantly.",
            },
            {
                title: "Auto-Categorize",
                desc: "Files are automatically sorted by extension — mp3, mp4, png, pdf, docx, and more — into clean, organized folders.",
            },
            {
                title: "Finder-Style UI",
                desc: "A sleek macOS-inspired interface with list and grid views, file inspection, and path navigation.",
            },
        ],
        glow: true,
        blendMultiply: true,
    },
    {
        number: "02",
        title: "File System Simulator",
        description:
            "An interactive educational tool for understanding OS file system concepts. Visualize how allocation strategies work with animated disk blocks, and explore fragmentation in real time.",
        image: "/assets/Processes.png",
        buttonLabel: "EXPLORE SIMULATOR",
        buttonLink: "/visualization",
        bullets: [
            {
                title: "Allocation Strategies",
                desc: "Switch between Contiguous, Linked, Indexed, and Unix Inode multi-level strategies and see how each allocates disk blocks.",
            },
            {
                title: "Disk Block Visualization",
                desc: "Watch files occupy disk blocks in real time with color-coded visual feedback and block-level detail.",
            },
            {
                title: "Fragmentation Analysis",
                desc: "Understand how fragmentation builds up and how different allocation strategies handle it differently.",
            },
        ],
        glow: true,
        blendMultiply: true,
    },
];


const FeatureCard = ({ feature, index, sticky }: { feature: FeatureData; index: number; sticky: boolean }) => {
    return (
        <div
            className={sticky ? "sticky h-screen w-full bg-white flex items-center" : "relative w-full bg-white py-14 sm:py-16"}
            style={sticky
                ? { top: "90px", zIndex: 10 + index, borderTop: "1px solid #e5e7eb" }
                : { borderTop: "1px solid #e5e7eb" }}
        >
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start max-w-[1400px] mx-auto">

                    <div className="lg:col-span-3 flex flex-col justify-start pt-4">
                        <span
                            className="inline-flex items-center gap-2 text-[12px] font-bold text-black uppercase block mb-3"
                            style={{ letterSpacing: "1.5px" }}
                        >
                            <span className="w-[5px] h-[5px] bg-black inline-block" />
                            {feature.number}
                        </span>
                        <h3
                            style={{
                                fontSize: "clamp(2rem, 5vw, 2.625rem)",
                                fontWeight: 500,
                                letterSpacing: "-0.03em",
                                lineHeight: "1.05",
                                color: "#000",
                                marginBottom: "16px",
                            }}
                        >
                            {feature.title}
                        </h3>
                        <p
                            className="text-[16px] leading-[1.65] mb-8"
                            style={{ color: "#6b7280", maxWidth: "280px" }}
                        >
                            {feature.description}
                        </p>
                        <Link to={feature.buttonLink}>
                            <button
                                className="text-[12px] font-medium text-white uppercase bg-black hover:bg-gray-800 transition-all inline-flex items-center justify-center self-start cursor-pointer"
                                style={{
                                    letterSpacing: "1.5px",
                                    padding: "12px 24px",
                                    height: "44px",
                                }}
                            >
                                {feature.buttonLabel}
                            </button>
                        </Link>
                    </div>


                    <div className="lg:col-span-6 flex items-center justify-center relative">
                        {feature.glow && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
                                <div 
                                    className="w-[100%] h-[100%] absolute"
                                    style={{
                                        background: "radial-gradient(circle at center, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 25%, rgba(6, 182, 212, 0.15) 50%, transparent 65%)",
                                        filter: "blur(30px)",
                                    }}
                                />
                            </div>
                        )}
                        <img
                            src={feature.image}
                            alt={feature.title}
                            className={`w-full h-auto relative ${feature.blendMultiply ? 'max-w-md lg:max-w-lg mt-4' : 'max-w-xl'}`}
                            style={{ 
                                filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.06))",
                                mixBlendMode: feature.blendMultiply ? "multiply" : "normal",
                                maskImage: feature.blendMultiply ? "radial-gradient(ellipse at center, black 50%, transparent 100%)" : "none",
                                WebkitMaskImage: feature.blendMultiply ? "radial-gradient(ellipse at center, black 50%, transparent 100%)" : "none",
                                transform: feature.blendMultiply ? "translateY(-10%)" : "none",
                                zIndex: 10
                            }}
                        />
                    </div>


                    <div className="lg:col-span-3 flex flex-col gap-8 pt-4">
                        {feature.bullets.map((b, i) => (
                            <div key={i}>
                                <h4
                                    className="text-[19px] font-medium text-black mb-2 flex items-start gap-2"
                                >
                                    <span className="text-gray-400 mt-0.5">•</span>
                                    {b.title}
                                </h4>
                                <p className="text-[15px] leading-relaxed pl-5" style={{ color: "#6b7280" }}>
                                    {b.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const ProcessFlow = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
    const headerY = useTransform(scrollYProgress, [0, 0.08], [0, -40]);

    return (
        <section ref={sectionRef} className="relative bg-white">

            <div className="relative px-4 sm:px-6 lg:px-10">
                <motion.div
                    style={{ opacity: headerOpacity, y: headerY }}
                    className="text-center py-20 sm:py-24"
                >
                    <span
                        className="inline-flex items-center gap-2 text-[11px] font-bold text-black uppercase mb-5"
                        style={{ letterSpacing: "1.5px" }}
                    >
                        <span className="w-[6px] h-[6px] bg-black inline-block" />
                        HOW IT WORKS
                    </span>
                    <h2
                        style={{
                            fontSize: "clamp(2rem, 4vw, 3.25rem)",
                            fontWeight: 500,
                            letterSpacing: "-1.5px",
                            lineHeight: "1.1",
                            color: "#000",
                        }}
                    >
                        Two powerful tools,
                        <br />
                        one platform
                    </h2>
                </motion.div>
            </div>


            <div className="lg:hidden">
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} feature={feature} index={idx} sticky={false} />
                ))}
            </div>

            <div className="hidden lg:block" style={{ height: `${features.length * 100}vh` }}>
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} feature={feature} index={idx} sticky={true} />
                ))}
            </div>
        </section>
    );
};
