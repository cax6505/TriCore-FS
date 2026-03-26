import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import { Package, Terminal, FolderOpen, Cpu, Layers } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const SidebarItem = ({ children, active, href }: { children: string, active?: boolean, href: string }) => (
    <li>
        <a
            href={href}
            onClick={(e) => {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', href);
                }
            }}
            className="block py-2.5 transition-all duration-200"
            style={{
                fontSize: '14px',
                fontWeight: active ? 600 : 400,
                color: active ? '#000' : '#999',
                letterSpacing: '-0.01em',
                borderLeft: active ? '2px solid #000' : '2px solid transparent',
                paddingLeft: '16px',
            }}
        >
            {children}
        </a>
    </li>
);

const Section = ({ id, title, icon: Icon, children }: { id: string, title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <motion.div
        id={id}
        className="mb-14 scroll-mt-32 group"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
    >
        <div
            style={{ border: '1px solid #e5e7eb', transition: 'box-shadow 0.3s ease' }}
            className="hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
        >
            <div className="p-8 md:p-12">
                <div className="flex items-center gap-3.5 mb-8">
                    <div
                        className="flex items-center justify-center shrink-0"
                        style={{ width: '36px', height: '36px', border: '1px solid #e0e0e0', background: '#fafafa' }}
                    >
                        <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: '1.15', color: '#000' }}>
                        {title}
                    </h2>
                </div>
                <div style={{ fontSize: '18px', lineHeight: '1.75', color: '#444' }}>
                    {children}
                </div>
            </div>
        </div>
    </motion.div>
);

const CodeBlock = ({ children }: { children: string }) => (
    <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', padding: '14px 18px', fontFamily: 'ui-monospace, monospace', fontSize: '15px', color: '#000', marginTop: '10px', marginBottom: '10px' }}>
        {children}
    </div>
);

const NpmPackage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const splineRef = useRef<any>(null);

    const onSplineLoad = useCallback((splineApp: any) => {
        splineRef.current = splineApp;
        setTimeout(() => {
            if (splineRef.current) {
                splineRef.current.stop();
            }
        }, 6500);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });

        const sections = document.querySelectorAll('[id]');
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white text-black font-sans">
                <Navbar />

                {/* Hero — full-screen Spline */}
                <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
                    {/* Spline — fills entire hero, shifted right */}
                    <div className="absolute inset-0" style={{ left: '25%', transform: 'scale(1.35)', transformOrigin: 'center center' }}>
                        <Spline
                            scene="https://prod.spline.design/1M3mBFdc89sTQ5J3/scene.splinecode"
                            style={{ width: '100%', height: '100%' }}
                            onLoad={onSplineLoad}
                        />
                    </div>

                    {/* Left white gradient — keeps text area clean */}
                    <div className="absolute inset-y-0 left-0 z-[1]" style={{ width: '45%', background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.7) 65%, rgba(255,255,255,0) 100%)' }} />

                    {/* Bottom fade */}
                    <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-white to-transparent z-[1]" />

                    {/* Text — bottom-left */}
                    <div className="absolute inset-0 z-[2] flex items-center pointer-events-none">
                        <div className="px-4 sm:px-6 lg:px-10 pb-0 pt-16 w-full pointer-events-auto">
                            <div className="max-w-[1400px] mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    style={{ maxWidth: '520px' }}
                                >
                                    <span
                                        className="inline-flex items-center gap-2 mb-5"
                                        style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}
                                    >
                                        <span className="w-[6px] h-[6px] bg-black inline-block" />
                                        NPM Package
                                    </span>
                                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '1.05', color: '#000' }}>
                                        Smart Folder
                                        <br />
                                        Organiser CLI Tool
                                    </h1>
                                    <p style={{ fontSize: '18px', fontWeight: 400, lineHeight: '1.6', color: '#444', marginTop: '18px', maxWidth: '460px' }}>
                                        A safe and efficient CLI tool designed to help you organize cluttered folders by categorizing files by their extensions.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <main className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                        {/* Sidebar */}
                        <aside className="lg:col-span-2 hidden lg:block sticky top-28 h-fit">
                            <span className="block mb-5" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: '#999', textTransform: 'uppercase' as const }}>
                                Contents
                            </span>
                            <ul className="space-y-0">
                                <SidebarItem href="#overview" active={activeSection === 'overview'}>Overview</SidebarItem>
                                <SidebarItem href="#features" active={activeSection === 'features'}>Features</SidebarItem>
                                <SidebarItem href="#installation" active={activeSection === 'installation'}>Installation</SidebarItem>
                                <SidebarItem href="#usage" active={activeSection === 'usage'}>Usage</SidebarItem>
                                <li className="h-4" />
                                <span className="block mb-1.5 pl-4" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', color: '#bbb', textTransform: 'uppercase' as const }}>Reference</span>
                                <SidebarItem href="#categories" active={activeSection === 'categories'}>Categories</SidebarItem>
                                <SidebarItem href="#tech" active={activeSection === 'tech'}>Technologies</SidebarItem>
                            </ul>
                        </aside>

                        {/* Content */}
                        <div className="lg:col-span-10 xl:pr-16">

                            {/* Overview */}
                            <motion.div
                                id="overview"
                                className="mb-24 scroll-mt-32"
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5 }}
                            >
                                <p style={{ fontSize: '19px', lineHeight: '1.7', color: '#444', maxWidth: '680px' }}>
                                    A safe and efficient Command Line Interface (CLI) tool designed to help you organize cluttered folders. It analyzes the files in a specified directory, categorizes them by their extensions, and allows you to either copy or move them into categorized subfolders.
                                </p>
                            </motion.div>

                            {/* Features */}
                            <Section id="features" title="Features" icon={Package}>
                                <div className="space-y-5">
                                    {[
                                        { label: 'Folder Analysis', desc: 'Scans the target directory and provides a detailed summary of the files found, including total file count and size.' },
                                        { label: 'Categorization', desc: 'Groups files into categories like images, pdfs, videos, documents, audio, code, and others based on their extensions.' },
                                        {
                                            label: 'Safe Organization Options', desc: <ul className="list-disc list-outside ml-6 mt-2 space-y-2" style={{ fontSize: '16px', color: '#555' }}>
                                                <li><strong style={{ color: '#000' }}>Copy:</strong> Safely copies files into their respective category folders, leaving the original files intact.</li>
                                                <li><strong style={{ color: '#000' }}>Move:</strong> Displaces the original files into the new category folders (includes a confirmation prompt to prevent accidental moves).</li>
                                            </ul>
                                        },
                                        { label: 'Flatten Directory', desc: <>A <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>--flatten</code> flag is available to move all files from subdirectories back into the root folder.</> },
                                        { label: 'Visual Progress', desc: 'Displays a progress bar during the organization process.' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '16px' }}>
                                            <strong style={{ color: '#000', fontWeight: 600, fontSize: '17px' }}>{item.label}</strong>
                                            <div style={{ color: '#555', marginTop: '4px' }}>{item.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* Installation */}
                            <Section id="installation" title="Installation" icon={Terminal}>
                                <p className="mb-4">You can use the tool instantly with npx (no installation required):</p>
                                <CodeBlock>npx smart-folder-organiser &lt;folder-path&gt;</CodeBlock>
                                <p className="mt-6 mb-4">Or, install it globally via npm to use the command anywhere:</p>
                                <CodeBlock>npm install -g smart-folder-organiser</CodeBlock>
                            </Section>

                            {/* Usage */}
                            <Section id="usage" title="Usage" icon={FolderOpen}>
                                <p className="mb-6">If you installed the package globally, you can simply use the <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>smart-folder-organiser</code> command followed by your target folder path.</p>

                                <div className="mt-8">
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>1. Analyze and Organise</h3>
                                    <p className="mb-3" style={{ color: '#555' }}>To analyze a folder and choose how to organize it (copy or move):</p>
                                    <CodeBlock>smart-folder-organiser &lt;folder-path&gt;</CodeBlock>
                                    <p className="mt-3 mb-3" style={{ color: '#666', fontStyle: 'italic' }}>Example:</p>
                                    <CodeBlock>smart-folder-organiser ./my-messy-folder</CodeBlock>
                                </div>

                                <div className="mt-10">
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>2. Flatten a Folder</h3>
                                    <p className="mb-3" style={{ color: '#555' }}>If you want to reverse an organization or simply pull all files from subfolders back into the main directory, use the <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>--flatten</code> flag.</p>
                                    <CodeBlock>smart-folder-organiser &lt;folder-path&gt; --flatten</CodeBlock>
                                    <p className="mt-3 mb-3" style={{ color: '#666', fontStyle: 'italic' }}>Example:</p>
                                    <CodeBlock>smart-folder-organiser ./my-messy-folder --flatten</CodeBlock>
                                </div>
                            </Section>

                            <div className="w-full mb-12 mt-20" style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' }} />

                            <div className="mb-12">
                                <span className="inline-flex items-center gap-2 mb-4" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                                    <span className="w-[6px] h-[6px] bg-black inline-block" />
                                    Reference
                                </span>
                                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: '1.1', color: '#000', marginBottom: '10px' }}>
                                    Categories & Tech
                                </h2>
                            </div>

                            {/* Categories */}
                            <Section id="categories" title="Supported Categories" icon={Layers}>
                                <p className="mb-6">Files are automatically categorized based on their extensions:</p>
                                <div className="space-y-4">
                                    {[
                                        { name: "images", exts: ".jpg, .jpeg, .png, .gif, .webp" },
                                        { name: "pdfs", exts: ".pdf" },
                                        { name: "videos", exts: ".mp4, .mkv, .mov" },
                                        { name: "documents", exts: ".doc, .docx, .txt, .xlsx, .csv" },
                                        { name: "audio", exts: ".mp3, .wav" },
                                        { name: "code", exts: ".js, .ts, .py, .java, .cpp, .c, .html, .css, .json, .md, .jsx, .tsx, .sh" },
                                        { name: "others", exts: "Any file extension not listed above." },
                                    ].map(cat => (
                                        <div key={cat.name} style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '16px', paddingTop: '4px', paddingBottom: '4px' }}>
                                            <strong style={{ fontFamily: 'ui-monospace, monospace', fontSize: '15px', color: '#000', background: '#f3f4f6', padding: '2px 8px' }}>{cat.name}</strong>
                                            <span style={{ marginLeft: '12px', color: '#666' }}>{cat.exts}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* Technologies */}
                            <Section id="tech" title="Technologies Used" icon={Cpu}>
                                <div className="space-y-4 mb-10">
                                    {[
                                        { name: 'inquirer', desc: 'For interactive command-line prompts.' },
                                        { name: 'picocolors', desc: 'For adding colors and formatting to the console output.' },
                                        { name: 'cli-progress', desc: 'For the visual progress bar during the copy/move operations.' },
                                    ].map(tech => (
                                        <div key={tech.name} style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '16px' }}>
                                            <strong style={{ color: '#000', fontWeight: 600, fontSize: '17px' }}>{tech.name}</strong>
                                            <p style={{ color: '#555', marginTop: '4px' }}>{tech.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: '#000', padding: '32px', marginTop: '32px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>Ready to organize?</h3>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 18px', fontFamily: 'ui-monospace, monospace', fontSize: '15px', color: '#fff', marginBottom: '20px' }}>
                                        npm i -g smart-folder-organiser
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <a
                                            href="https://github.com/nandu-99/smart_folder_organiser"
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                display: 'inline-block',
                                                background: '#fff',
                                                color: '#000',
                                                padding: '10px 24px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase' as const,
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
                                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                                        >
                                            GitHub Repo
                                        </a>
                                        <a
                                            href="https://www.npmjs.com/package/smart-folder-organiser"
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                display: 'inline-block',
                                                background: '#fff',
                                                color: '#000',
                                                padding: '10px 24px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                letterSpacing: '1.5px',
                                                textTransform: 'uppercase' as const,
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
                                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                                        >
                                            NPM Package
                                        </a>
                                    </div>
                                </div>
                            </Section>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default NpmPackage;
