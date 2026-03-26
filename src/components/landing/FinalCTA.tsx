import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const paperLineWidths = ["42%", "56%", "64%", "72%", "81%", "88%", "67%", "53%"];

export const FinalCTA = () => {
    return (
        <section className="relative py-24 lg:py-28 bg-[#f8fafc] overflow-hidden">
            {}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="relative z-10 px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-[1400px] mx-auto items-center">
                    {/* Left Column (Heading) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-start lg:justify-center"
                    >
                        <h2
                            style={{
                                fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
                                fontWeight: 500,
                                letterSpacing: "-0.03em",
                                lineHeight: "1.08",
                                color: "#000",
                            }}
                        >
                            Ready to
                            <br />
                            organize
                            <br />
                            and learn?
                        </h2>
                    </motion.div>

                    {/* Middle Column (Image) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex justify-center items-center"
                    >
                        <img 
                            src="/assets/download.svg" 
                            alt="Download Illustration"
                            className="w-full h-auto max-w-[320px] lg:max-w-[400px]"
                            style={{ 
                                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.05))",
                                transform: "scale(1.1)",
                                mixBlendMode: "multiply",
                                maskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)",
                                WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)"
                            }}
                        />
                    </motion.div>

                    {/* Right Column (Text and Buttons) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="flex flex-col justify-center"
                    >
                        <p className="text-[16px] text-gray-700 leading-[1.65] max-w-sm mb-8">
                            Jump into the smart file organizer to clean up
                            your folders, or explore how your operating system
                            manages files under the hood with interactive
                            visualizations and allocation strategy simulations.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="https://github.com/nandu-99/TriCoreFS"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button
                                    className="text-[13px] font-medium text-black uppercase bg-white hover:bg-gray-50 transition-all"
                                    style={{
                                        letterSpacing: "0.48px",
                                        border: "1px solid #e7e7e7",
                                        padding: "10px 24px",
                                        height: "44px",
                                    }}
                                >
                                    View on GitHub
                                </button>
                            </a>
                            <Link to="/visualization">
                                <Button
                                    className="text-[13px] font-medium text-white uppercase bg-black hover:bg-gray-900 transition-all"
                                    style={{
                                        letterSpacing: "0.48px",
                                        border: "1px solid black",
                                        padding: "10px 24px",
                                        height: "44px",
                                    }}
                                >
                                    Launch App
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
