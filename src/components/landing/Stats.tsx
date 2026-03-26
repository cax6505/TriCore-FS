import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const Counter = ({
    from,
    to,
    duration,
    suffix = "",
}: {
    from: number;
    to: number;
    duration: number;
    suffix?: string;
}) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: true, margin: "-100px" });
    const [count, setCount] = useState(from);

    useEffect(() => {
        if (inView) {
            let start = 0;
            const step = (timestamp: number) => {
                if (!start) start = timestamp;
                const progress = Math.min(
                    (timestamp - start) / (duration * 1000),
                    1,
                );
                
                const eased = 1 - Math.pow(1 - progress, 3);
                setCount(Math.floor(eased * (to - from) + from));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }, [inView, from, to, duration]);

    return <span ref={nodeRef}>{count}{suffix}</span>;
};

const stats = [
    {
        value: 500,
        suffix: "M+",
        label: "Pages Processed",
        gradient: "from-blue-400 to-blue-600",
        color: "#3b82f6",
    },
    {
        value: 25,
        suffix: "M+",
        label: "Documents Analyzed",
        gradient: "from-violet-400 to-purple-600",
        color: "#8b5cf6",
    },
    {
        value: 300,
        suffix: "k+",
        label: "Developers",
        gradient: "from-orange-400 to-pink-600",
        color: "#f97316",
    },
];

export const Stats = () => {
    return (
        <section className="relative py-32 bg-white overflow-hidden">
            {}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f97316)" }}
            />

            <div style={{ margin: "0 40px" }}>
                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20 max-w-6xl mx-auto"
                >
                    <span
                        className="inline-flex items-center gap-2 text-[11px] font-bold text-black uppercase mb-6"
                        style={{ letterSpacing: "1.5px" }}
                    >
                        <span className="w-[6px] h-[6px] bg-black inline-block" />
                        TRACTION
                    </span>
                    <h2
                        style={{
                            fontSize: "clamp(2rem, 4vw, 3.5rem)",
                            fontWeight: 500,
                            letterSpacing: "-1.5px",
                            lineHeight: "1.1",
                            color: "#000",
                        }}
                    >
                        Redefining enterprise scale for
                        <br />
                        uncertain workflows
                    </h2>
                </motion.div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.12, duration: 0.5 }}
                            className="text-center py-8 relative"
                            style={{
                                borderRight: idx < stats.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                            }}
                        >
                            {}
                            <div
                                className="absolute top-0 left-1/4 right-1/4 h-[2px]"
                                style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                            />
                            <div className="relative mb-3">
                                <span
                                    className="text-[4rem] sm:text-[5rem] font-medium leading-none tracking-tight"
                                    style={{ color: stat.color }}
                                >
                                    <Counter
                                        from={0}
                                        to={stat.value}
                                        duration={2}
                                        suffix={stat.suffix}
                                    />
                                </span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase" style={{ letterSpacing: "1.5px" }}>
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};
