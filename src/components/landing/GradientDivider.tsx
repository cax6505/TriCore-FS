import { motion } from "framer-motion";


export const GradientDivider = ({
    colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#f97316", "#eab308"],
    height = 3,
    className = "",
}: {
    colors?: string[];
    height?: number;
    className?: string;
}) => {
    
    const blockCount = 80;
    const blocks = Array.from({ length: blockCount }, (_, i) => {
        const progress = i / (blockCount - 1);
        const colorIndex = Math.floor(progress * (colors.length - 1));
        const nextIndex = Math.min(colorIndex + 1, colors.length - 1);
        const localProgress = (progress * (colors.length - 1)) - colorIndex;

        
        const color = localProgress < 0.5 ? colors[colorIndex] : colors[nextIndex];
        
        const opacity = 0.7 + Math.random() * 0.3;

        return { color, opacity };
    });

    return (
        <motion.div
            className={`w-full flex ${className}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "left center" }}
        >
            {blocks.map((block, i) => (
                <div
                    key={i}
                    className="flex-1"
                    style={{
                        height: `${height}px`,
                        backgroundColor: block.color,
                        opacity: block.opacity,
                    }}
                />
            ))}
        </motion.div>
    );
};


export const SectionHeader = ({
    label,
    title,
    description,
    align = "center",
}: {
    label: string;
    title: React.ReactNode;
    description?: string;
    align?: "left" | "center";
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-16 max-w-6xl mx-auto ${align === "center" ? "text-center" : ""}`}
        >
            <span
                className={`inline-flex items-center gap-2 text-[11px] font-bold text-black uppercase mb-6 ${align === "center" ? "" : ""}`}
                style={{ letterSpacing: "1.5px" }}
            >
                <span className="w-[6px] h-[6px] bg-black inline-block" />
                {label}
            </span>
            <h2
                style={{
                    fontSize: "clamp(2rem, 4vw, 3.25rem)",
                    fontWeight: 500,
                    letterSpacing: "-1.5px",
                    lineHeight: "1.1",
                    color: "#000",
                    marginBottom: description ? "16px" : "0",
                }}
            >
                {title}
            </h2>
            {description && (
                <p className="text-[15px] text-gray-500 max-w-xl leading-[1.7]" style={align === "center" ? { margin: "0 auto" } : undefined}>
                    {description}
                </p>
            )}
        </motion.div>
    );
};
