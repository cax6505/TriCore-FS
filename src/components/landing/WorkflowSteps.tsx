import { motion } from "framer-motion";
import { FileText, Cpu, Rocket } from "lucide-react";

const steps = [
    {
        step: "01",
        label: "Parse",
        icon: <FileText className="w-5 h-5" />,
        color: "text-blue-600",
        bg: "bg-blue-50",
        borderColor: "border-blue-200",
        title: "Parse any document with world‑leading accuracy",
        description:
            "SaveParse delivers state-of-the-art PDF parsing and OCR, handling complex tables, multi-column layouts, embedded images, and handwritten text with unmatched precision.",
        image: "/assets/imgi_24_07766393ac8f2f199ac50a29f15d97082b17272d-1616x1360.png",
        imageAlt: "SaveParse document parsing flow — from raw PDF to structured output",
        reverse: false,
    },
    {
        step: "02",
        label: "Extract",
        icon: <Cpu className="w-5 h-5" />,
        color: "text-violet-600",
        bg: "bg-violet-50",
        borderColor: "border-violet-200",
        title: "Go beyond parsing and extract custom objects",
        description:
            "Define schemas and extract structured data from any document. Tables, key-value pairs, line items — all mapped to your exact data model automatically.",
        image: "/assets/imgi_25_b7ebaada9d83b4cafbbf6c444e228919d0421fdd-1616x1360.png",
        imageAlt: "Schema extraction — defining fields and getting structured JSON output",
        reverse: true,
    },
    {
        step: "03",
        label: "Deploy",
        icon: <Rocket className="w-5 h-5" />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        borderColor: "border-emerald-200",
        title: "Build reliable agentic workflows",
        description:
            "Orchestrate event-driven agentic pipelines that gather, process, and validate data across multiple steps — with full observability and human-in-the-loop support.",
        image: "/assets/imgi_27_0586db759cc7b58bf1dc1634803ead8675ec6ed9-1616x1616.png",
        imageAlt: "Event-driven workflow — gather, process, deploy pipeline",
        reverse: false,
    },
];

export const WorkflowSteps = () => {
    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-24"
                >
                    <span className="inline-block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-5 px-4 py-2 bg-slate-100 rounded-full">
                        How it works
                    </span>
                    <h2 className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] font-bold text-slate-900 tracking-tight leading-[1.05]">
                        Plan, Build, Deploy
                    </h2>
                </motion.div>

                {}
                <div className="space-y-32 max-w-6xl mx-auto">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col ${step.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}
                        >
                            {}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: step.reverse ? 40 : -40,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="flex-1 max-w-lg"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className={`${step.bg} p-2.5 rounded-xl border ${step.borderColor}`}
                                    >
                                        <span className={step.color}>
                                            {step.icon}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono font-bold text-slate-300 tracking-wider">
                                            {step.step}
                                        </span>
                                        <span
                                            className={`text-[13px] font-bold ${step.color} uppercase tracking-widest`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </motion.div>

                            {}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: step.reverse ? -40 : 40,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.15 }}
                                className="flex-1 w-full"
                            >
                                <div className="relative group">
                                    {}
                                    <div
                                        className={`absolute -inset-4 rounded-3xl blur-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-50 ${idx === 0
                                                ? "bg-blue-200"
                                                : idx === 1
                                                    ? "bg-violet-200"
                                                    : "bg-emerald-200"
                                            }`}
                                    />
                                    <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30 overflow-hidden p-2">
                                        <img
                                            src={step.image}
                                            alt={step.imageAlt}
                                            className="w-full h-auto rounded-xl"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
