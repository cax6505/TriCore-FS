import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { motion } from "framer-motion";
import { FolderTree, LayoutTemplate, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";

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

const GuideSection = ({ id, title, children }: { id: string, title: React.ReactNode, children: React.ReactNode }) => (
    <motion.div
        id={id}
        className="mb-24 scroll-mt-32"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
    >
        <h2
            className="mb-8"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: '1.15', color: '#000' }}
        >
            {title}
        </h2>
        <div style={{ border: '1px solid #e5e7eb' }}>
            <div className="p-8 md:p-10" style={{ fontSize: '18px', lineHeight: '1.75', color: '#444' }}>
                {children}
            </div>
        </div>
    </motion.div>
);

const ConceptSection = ({
    id, title, icon: Icon, imageSrc, description, benefits, tradeoffs
}: {
    id: string, title: React.ReactNode, icon: React.ElementType, imageSrc: string, description: React.ReactNode, benefits: React.ReactNode, tradeoffs: React.ReactNode
}) => (
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
                <div className="flex flex-col xl:flex-row gap-10 xl:gap-12 mb-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div
                                className="flex items-center justify-center shrink-0"
                                style={{ width: '36px', height: '36px', border: '1px solid #e0e0e0', background: '#fafafa' }}
                            >
                                <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                            </div>
                            <h3 style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: '1.15', color: '#000' }}>
                                {title}
                            </h3>
                        </div>
                        <div style={{ fontSize: '18px', lineHeight: '1.75', color: '#444' }} className="space-y-4">
                            {description}
                        </div>
                    </div>
                    <div className="xl:w-[42%] xl:shrink-0 w-full">
                        <div className="overflow-hidden" style={{ border: '1px solid #e5e7eb', aspectRatio: '4/3' }}>
                            <img src={imageSrc} alt={`${title} visualization`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out" />
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-1 ${tradeoffs ? 'md:grid-cols-2' : ''} gap-px`} style={{ background: '#e5e7eb', border: '1px solid #e5e7eb' }}>
                    <div className="p-6 bg-white">
                        <span className="block mb-2.5" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                            Benefits
                        </span>
                        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>{benefits}</p>
                    </div>
                    {tradeoffs && (
                        <div className="p-6 bg-white">
                            <span className="block mb-2.5" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                                Trade-offs
                            </span>
                            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>{tradeoffs}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

const OrganiserGuide = () => {
    const [activeSection, setActiveSection] = useState('overview');

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

                <div className="relative w-full overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to right, #7dd3fc, #a5b4fc, #c084fc, #f0abfc, #fda4af)' }}
                    />
                    <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-white to-transparent z-[1]" />
                    <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-white to-transparent z-[1]" />

                    <div className="relative z-10 px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-16 sm:pb-20">
                        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span
                                    className="inline-flex items-center gap-2 mb-6"
                                    style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}
                                >
                                    <span className="w-[6px] h-[6px] bg-black inline-block" />
                                    Documentation
                                </span>
                                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: '1.05', color: '#000' }}>
                                    Smart File
                                    <br />
                                    Organiser Guide
                                </h1>
                                <p style={{ fontSize: '19px', fontWeight: 400, lineHeight: '1.5', color: '#333', marginTop: '20px', maxWidth: '520px' }}>
                                    Welcome to the Smart File Organiser! This route provides a stunning macOS Finder-style interface designed to help you strictly safely analyze the messiest local folders on your hard drive.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.12 }}
                                className="flex items-center justify-center lg:justify-end"
                            >
                                <img
                                    src="/assets/imgi_46_footer.svg"
                                    alt="File organiser diagram"
                                    className="w-full max-w-[400px] h-auto"
                                    style={{ filter: 'invert(1)' }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>

                <main className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                        <aside className="lg:col-span-2 hidden lg:block sticky top-28 h-fit">
                            <span className="block mb-5" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: '#999', textTransform: 'uppercase' as const }}>
                                Contents
                            </span>
                            <ul className="space-y-0">
                                <SidebarItem href="#overview" active={activeSection === 'overview'}>Overview</SidebarItem>
                                <SidebarItem href="#how-to-use" active={activeSection === 'how-to-use'}>How to Use</SidebarItem>
                                <li className="h-4" />
                                <span className="block mb-1.5 pl-4" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', color: '#bbb', textTransform: 'uppercase' as const }}>OS Concepts</span>
                                <SidebarItem href="#virtualization" active={activeSection === 'virtualization'}>Virtualization & State</SidebarItem>
                                <SidebarItem href="#traversal" active={activeSection === 'traversal'}>Recursive Traversal</SidebarItem>
                            </ul>
                        </aside>

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
                                    Below, we'll explain how to use the interface to categorize files by extension, and dive into the Operating System and Data Structure concepts that make this completely magical, fast, and 100% safe.
                                </p>
                            </motion.div>

                            <GuideSection id="how-to-use" title="How to Use">
                                <p className="mb-6">The Organiser route provides an incredibly intuitive user flow modeled directly off modern desktop operating systems.</p>
                                <ol className="list-decimal list-outside ml-6 space-y-5">
                                    <li>
                                        <strong style={{ color: '#000', fontWeight: 600 }}>Step 1. Upload a Folder:</strong> When you arrive at <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>/organiser</code>, you're greeted with a massive drop zone. You can either <strong style={{ color: '#000' }}>drag and drop a whole folder</strong> from your desktop directly into the browser, or click the <strong style={{ color: '#000' }}>"Browse Folder"</strong> button to use a native file picker dialog.
                                    </li>
                                    <li>
                                        <strong style={{ color: '#000', fontWeight: 600 }}>Step 2. Free Exploration:</strong> A robust Mac-like Floating Window appears.
                                        <ul className="list-disc list-outside ml-6 mt-3 space-y-2" style={{ color: '#555' }}>
                                            <li><strong style={{ color: '#000' }}>Locations:</strong> Your uploaded folder is mounted on the left sidebar under "Local Disk".</li>
                                            <li><strong style={{ color: '#000' }}>Toolbar:</strong> Contains Breadcrumbs for navigation, total file count, view toggles (Grid/List), and Reset logic.</li>
                                            <li>Double click to dive down through recursive directories cleanly.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong style={{ color: '#000', fontWeight: 600 }}>Step 3. The Magic "Organise" Button:</strong> Click the blue Organise button on the top right. A gorgeous full-screen blur animation will kick in while the algorithm computes. After ~2 seconds, a brand new <strong style={{ color: '#000' }}>Organised</strong> folder will appear on the sidebar. Clicking it reveals your completely flattened file directory neatly categorized into bins like "Images", "PDFs", and "Documents".
                                    </li>
                                </ol>
                            </GuideSection>

                            <div className="mb-12 mt-20">
                                <div className="w-full mb-10" style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' }} />
                                <span className="inline-flex items-center gap-2 mb-4" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                                    <span className="w-[6px] h-[6px] bg-black inline-block" />
                                    OS Concepts
                                </span>
                                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: '1.1', color: '#000', marginBottom: '10px' }}>
                                    Operating System Concepts Under the Hood
                                </h2>
                                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#666', maxWidth: '620px' }}>
                                    Why build a file browser in a web browser? To demonstrate core concepts surrounding file structures, virtualization, and traversal without needing to mess around in bash scripts.
                                </p>
                            </div>

                            <ConceptSection
                                id="virtualization"
                                title="1. Abstract Virtualization & Safety"
                                icon={ShieldCheck}
                                imageSrc="/guide/organiser_virtualization.png"
                                description={
                                    <>
                                        <p>
                                            A major fear when dealing with file organizers (like desktop scripts you might run) is the risk of accidental <strong style={{ color: '#000' }}>Data Loss</strong>. If a script improperly moves files, you might lose your complex project hierarchies forever.
                                        </p>
                                        <p>
                                            In OS Design, <strong style={{ color: '#000' }}>Virtualization</strong> involves dividing physical reality (the hard drive) into simulated logical concepts. The Smart File Organiser takes this to an extreme. It doesn't write <em>anything</em> to your physical disk. When it "Organises" your files by categories, it iterates over the JSON tree stored deep in <strong style={{ color: '#000' }}>React State (RAM)</strong>, cloning pointers, and constructing an entirely brand-new virtual directory structure in memory—leaving your physical Hard Drive 100% untouched.
                                        </p>
                                    </>
                                }
                                benefits="Perfect isolation. You can safely drop your incredibly sensitive 'C://Windows' or '/Users/admin' folders into the browser to analyze what's taking up space or what extensions are common, without any fear whatsoever that the 'Organise' function will randomly rewrite your Operating System folders."
                                tradeoffs="Because it relies on Browser RAM purely, attempting to drop a folder with millions of massive nested components could theoretically cause an out-of-memory browser crash (unlike native disk manipulation)."
                            />

                            <ConceptSection
                                id="traversal"
                                title="2. Fast Recursive Directory Traversal"
                                icon={FolderTree}
                                imageSrc="/guide/organiser_traversal.png"
                                description={
                                    <>
                                        <p>
                                            File structures on all OSes take the form of an <strong style={{ color: '#000' }}>N-ary Tree</strong>. When you drag and drop a folder into the browser, we use the <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>webkitGetAsEntry()</code> API to hook into your native FileSystem directory structure.
                                        </p>
                                        <p>
                                            The application executes an asynchronous recursive function (<code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>parseDirectoryEntry</code>). When it sees a file, it catalogs its leaf node data (size, extension). When it sees a directory, the algorithm <em>pauses</em> and recursively re-calls itself deeply diving into that sub-folder before bubbling the result upwards to construct a massive structured DOM tree that renders in real-time.
                                        </p>
                                    </>
                                }
                                benefits="Highly efficient data ingestion handling both native Drag & Drop events and OS-level File Input parsing flows simultaneously. Prepares an exact 1:1 replica of the tree for rendering."
                                tradeoffs={null}
                            />

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default OrganiserGuide;
