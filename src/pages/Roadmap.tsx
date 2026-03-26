import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import Spline from "@splinetool/react-spline";
import React from "react";


const GeoPattern1 = () => (
    <div className="absolute inset-0 overflow-hidden bg-[#f3f4f6]">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-pink-200 to-orange-100 rounded-full blur-2xl opacity-60" />
        { }
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        { }
        <div className="absolute bottom-0 right-0 w-full h-2/3 bg-gradient-to-t from-white/80 to-transparent" />
    </div>
);

const GeoPattern2 = () => (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="absolute top-0 right-0 w-full h-full opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full rotate-12 scale-150">
                <rect x="20" y="20" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300" />
                <rect x="40" y="40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-300" />
            </svg>
        </div>
    </div>
);

const GeoPattern3 = () => (
    <div className="absolute inset-0 overflow-hidden bg-[#fafafa] border-b border-gray-100">
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-50" />
    </div>
);




const SidebarItem = ({ children, active }: { children: string, active?: boolean }) => (
    <li className={`text-[11px] font-bold uppercase tracking-widest py-2 cursor-pointer transition-colors ${active ? "text-black" : "text-gray-400 hover:text-black"}`}>
        {children}
    </li>
);

const MetaTag = ({ date, tags }: { date: string, tags: string[] }) => (
    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-wide mb-3">
        <span>{date}</span>
        <span>*</span>
        {tags.map(tag => (
            <span key={tag}>[ {tag} ]</span>
        ))}
    </div>
);

const ArticleCard = ({
    title,
    date,
    tags,
    bgComponent,
    highlight = false,
    onHover
}: {
    title: string,
    date: string,
    tags: string[],
    bgComponent: React.ReactNode,
    highlight?: boolean,
    onHover?: () => void
}) => {
    return (
        <div
            className={`group cursor-pointer flex flex-col h-full ${highlight ? "mb-12" : ""}`}
            onMouseEnter={onHover}
        >
            { }
            <div className={`relative w-full overflow-hidden mb-6 border border-gray-100 transition-all duration-500 group-hover:border-gray-300 ${highlight ? "aspect-[1.7/1] md:aspect-[2.1/1]" : "aspect-[16/10]"}`}>
                {bgComponent}
                { }
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </div>

            { }
            <div className="flex flex-col">
                {highlight && (
                    <span className="text-lg font-medium mb-2 block">Feature Highlight:</span>
                )}
                <h3 className={`${highlight ? "text-4xl md:text-5xl tracking-tight" : "text-2xl tracking-tight"} font-bold text-black mb-4 leading-[1.1] group-hover:opacity-70 transition-opacity`}>
                    {title}
                </h3>
                <MetaTag date={date} tags={tags} />
            </div>
        </div>
    );
};

const Roadmap = () => {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white text-black font-sans selection:bg-pink-100 selection:text-pink-900">
                <Navbar />

                <main className="pt-32 pb-20 px-6 sm:px-10">
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                        { }
                        <aside className="lg:col-span-2 hidden lg:block sticky top-32 h-fit">
                            <h4 className="text-[12px] font-bold mb-6">Topics</h4>
                            <ul className="space-y-1">
                                <SidebarItem active>ALL</SidebarItem>
                                <SidebarItem>VISUALIZATION</SidebarItem>
                                <SidebarItem>STORAGE</SidebarItem>
                                <SidebarItem>CLOUD</SidebarItem>
                                <SidebarItem>AI AGENTS</SidebarItem>
                                <SidebarItem>MAC NATIVE</SidebarItem>
                                <SidebarItem>OPEN SOURCE</SidebarItem>
                                <div className="h-4" />
                                <SidebarItem>+ MORE</SidebarItem>
                            </ul>
                        </aside>

                        { }
                        <div className="lg:col-span-10">

                            {/* Hero highlight card with Spline 3D scene */}
                            <div className="mb-20">
                                <ArticleCard
                                    highlight
                                    title="Beyond Native Finder: Why Visual Storage Intelligence Matters"
                                    date="FEB 19, 2026"
                                    tags={["STORAGE INTELLIGENCE", "VISUALIZATION"]}
                                    bgComponent={
                                        <div className="absolute inset-0 overflow-hidden bg-[#f3f4f6]">
                                            {/* Spline: oversized container so scene renders fully — card overflow-hidden clips the edges cleanly */}
                                            <div
                                                style={{ position: "absolute", top: "-18%", left: "-3%", right: "-3%", bottom: "-10%" }}
                                            >
                                                <Spline
                                                    scene="https://prod.spline.design/1M3mBFdc89sTQ5J3/scene.splinecode"
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            </div>
                                        </div>
                                    }
                                />
                            </div>

                            { }
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-24">

                                <ArticleCard
                                    title="Feature Highlight: Storage Heatmap Visualization"
                                    date="MAR 10, 2026"
                                    tags={["IN DEVELOPMENT", "UI/UX"]}
                                    bgComponent={
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                                            <div className="w-2/3 h-2/3 border border-rose-200/50 rotate-3 grid grid-cols-2 gap-1 p-1">
                                                <div className="bg-rose-200/40 col-span-2" />
                                                <div className="bg-rose-300/40" />
                                                <div className="bg-rose-100/40" />
                                            </div>
                                        </div>
                                    }
                                />

                                <ArticleCard
                                    title="Intelligent Duplicate Detection: The SHA-256 Engine"
                                    date="APR 05, 2026"
                                    tags={["PLANNED", "ALGORITHMS"]}
                                    bgComponent={<GeoPattern2 />}
                                />

                                <ArticleCard
                                    title="DriveMerge: Extending Local Storage to the Cloud"
                                    date="MAY 21, 2026"
                                    tags={["RESEARCHING", "CLOUD"]}
                                    bgComponent={<GeoPattern3 />}
                                />

                            </div>

                            { }
                            <div className="border border-gray-200 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 bg-white">
                                <div className="max-w-xl">
                                    <h3 className="text-2xl font-bold mb-4">Get updates on the roadmap</h3>
                                    <p className="text-gray-500">
                                        Join the developer newsletter to get notified when new features like Heatmaps and DriveMerge land in stable.
                                    </p>
                                </div>
                                <div className="w-full md:w-auto">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            placeholder="jane@example.com"
                                            className="border border-gray-200 px-4 py-3 min-w-[260px] text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                        <button className="bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>
                            </div>

                            { }
                            <div className="mt-24">
                                <h4 className="text-2xl font-bold mb-10">Latest RFCs</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                    {[
                                        { title: "RFC: Background Storage Daemon Architecture", date: "JAN 15, 2026", tag: "SYSTEM" },
                                        { title: "RFC: Plugin API for Custom Visualizers", date: "JAN 10, 2026", tag: "API" },
                                        { title: "RFC: Privacy-First Indexing Strategy", date: "DEC 28, 2025", tag: "SECURITY" },
                                    ].map((item, i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="h-[1px] w-full bg-gray-200 mb-6 group-hover:bg-gray-400 transition-colors" />
                                            <h5 className="text-xl font-bold mb-3 leading-tight group-hover:text-gray-600 transition-colors">{item.title}</h5>
                                            <MetaTag date={item.date} tags={[item.tag]} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default Roadmap;
