import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { motion } from "framer-motion";
import { AlignJustify, Database, Layers, Link2, ListTree, PlayCircle, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

const StrategySection = ({
    id, title, icon: Icon, imageSrc, description, pros, cons, testScenario
}: {
    id: string, title: React.ReactNode, icon: React.ElementType, imageSrc: string, description: React.ReactNode, pros: React.ReactNode, cons: React.ReactNode, testScenario: React.ReactNode[]
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
                        <p className="mb-3" style={{ fontSize: '14px', fontWeight: 500, color: '#888', letterSpacing: '0.02em' }}>How it works:</p>
                        <p style={{ fontSize: '18px', lineHeight: '1.75', color: '#444' }}>
                            {description}
                        </p>
                    </div>
                    <div className="xl:w-[38%] xl:shrink-0 w-full">
                        <div className="overflow-hidden" style={{ border: '1px solid #e5e7eb', aspectRatio: '4/3' }}>
                            <img src={imageSrc} alt={`${title} visualization`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: '#e5e7eb', border: '1px solid #e5e7eb' }}>
                    <div className="p-6 bg-white">
                        <span className="block mb-2.5" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                            Pros
                        </span>
                        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>{pros}</p>
                    </div>
                    <div className="p-6 bg-white">
                        <span className="block mb-2.5" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                            Cons
                        </span>
                        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>{cons}</p>
                    </div>
                </div>

                <div className="mt-10 pt-8" style={{ borderTop: '1px solid #e5e7eb' }}>
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="flex items-center justify-center" style={{ width: '24px', height: '24px', background: '#000' }}>
                            <PlayCircle className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                            Test Scenario
                        </span>
                        <Link to={`/visualization?strategy=${id}`} className="ml-auto text-sm hidden sm:inline text-[#aaa] hover:text-black transition-colors">
                            Try it in Visualization
                        </Link>
                    </div>
                    <ol className="list-decimal list-outside ml-5 space-y-3" style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>
                        {testScenario.map((step, i) => (
                            <li key={i} className="pl-1">{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    </motion.div>
);

const Guide = () => {
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
                                    TriCoreFS
                                    <br />
                                    Visualization Guide
                                </h1>
                                <p style={{ fontSize: '19px', fontWeight: 400, lineHeight: '1.5', color: '#333', marginTop: '20px', maxWidth: '520px' }}>
                                    Welcome to the TriCoreFS Visualization tool! This route provides an interactive, visual way to understand how different file system allocation strategies manage disk space and inodes under the hood.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.12 }}
                                className="flex items-center justify-center lg:justify-end"
                            >
                                <img
                                    src="/assets/imgi_1_Main.svg"
                                    alt="File system diagram"
                                    className="w-full max-w-[400px] h-auto"
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
                                <SidebarItem href="#interface" active={activeSection === 'interface'}>The Interface</SidebarItem>
                                <SidebarItem href="#testing" active={activeSection === 'testing'}>Testing Basics</SidebarItem>
                                <li className="h-4" />
                                <span className="block mb-1.5 pl-4" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', color: '#bbb', textTransform: 'uppercase' as const }}>Strategies</span>
                                <SidebarItem href="#contiguous" active={activeSection === 'contiguous'}>Contiguous</SidebarItem>
                                <SidebarItem href="#linked" active={activeSection === 'linked'}>Linked</SidebarItem>
                                <SidebarItem href="#indexed" active={activeSection === 'indexed'}>Indexed</SidebarItem>
                                <SidebarItem href="#fat" active={activeSection === 'fat'}>FAT</SidebarItem>
                                <SidebarItem href="#unix" active={activeSection === 'unix'}>UNIX / Ext</SidebarItem>
                                <li className="h-4" />
                                <span className="block mb-1.5 pl-4" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', color: '#bbb', textTransform: 'uppercase' as const }}>Deep Dive</span>
                                <SidebarItem href="#inspector" active={activeSection === 'inspector'}>Path Resolution</SidebarItem>
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
                                    This guide will walk you through how to use the interface, what each allocation strategy does, and provide step-by-step test scenarios so you can see the strengths and weaknesses of each approach in real-time.
                                </p>
                            </motion.div>

                            <GuideSection id="interface" title="The Interface Overview">
                                <p className="mb-6">The Visualization route is divided into four main panels:</p>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Directory Tree (Left)', desc: 'Shows the hierarchical structure of your folders.' },
                                        { label: 'File Explorer (Center)', desc: 'Displays the files in the currently selected directory. You can toggle between List and Grid views. From here, you can right-click to create, rename, or delete files.' },
                                        { label: 'Inspector (Right)', desc: 'Shows detailed metadata about the currently selected file, including its Inode number, size, creation date, permissions, path resolution steps, and an exact list of the disk blocks allocated to it.' },
                                        { label: 'Disk Block Visualizer (Bottom)', desc: 'A real-time heatmap of your entire disk. Each tiny square represents one 4KB disk block.' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '16px' }}>
                                            <strong style={{ color: '#000', fontWeight: 600, fontSize: '17px' }}>{item.label}</strong>
                                            <p style={{ color: '#555', marginTop: '4px' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 ml-4 space-y-1" style={{ fontSize: '16px', color: '#666' }}>
                                    <p><strong style={{ color: '#000' }}>Empty squares:</strong> Free blocks</p>
                                    <p><strong style={{ color: '#000' }}>Filled squares:</strong> Allocated blocks</p>
                                    <p><strong style={{ color: '#000' }}>Highlighted squares:</strong> Blocks belonging to the currently selected file.</p>
                                </div>
                            </GuideSection>

                            <GuideSection id="testing" title="Testing File Operations">
                                <p className="mb-5" style={{ color: '#888', fontStyle: 'italic' }}>Before diving into strategies, let's learn how to trigger the visualization.</p>
                                <ol className="list-decimal list-outside ml-6 space-y-4" style={{ fontSize: '18px' }}>
                                    <li>Select the <strong style={{ color: '#000' }}>Root (/)</strong> directory in the left Tree panel.</li>
                                    <li>In the central File Explorer, right-click and select <strong style={{ color: '#000' }}>New Folder</strong> or click the <strong style={{ color: '#000' }}>New File</strong> icon in the header.</li>
                                    <li>
                                        When creating a file, you are asked for a <strong style={{ color: '#000' }}>Size (KB)</strong>. The system uses a <strong style={{ color: '#000' }}>4KB block size</strong>.
                                        <ul className="list-disc list-outside ml-6 mt-3 space-y-1" style={{ fontSize: '16px', color: '#666' }}>
                                            <li>A 4KB file takes 1 block.</li>
                                            <li>A 12KB file takes 3 blocks.</li>
                                            <li>A 20KB file takes 5 blocks.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </GuideSection>

                            <div className="mb-12 mt-20">
                                <div className="w-full mb-10" style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' }} />
                                <span className="inline-flex items-center gap-2 mb-4" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#000', textTransform: 'uppercase' as const }}>
                                    <span className="w-[6px] h-[6px] bg-black inline-block" />
                                    Strategies
                                </span>
                                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: '1.1', color: '#000', marginBottom: '10px' }}>
                                    Allocation Strategies
                                </h2>
                                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#666', maxWidth: '620px' }}>
                                    To change the current strategy, click the "Strategy" dropdown in the top toolbar. Remember that changing the strategy will re-allocate existing files based on the new rules.
                                </p>
                            </div>

                            <StrategySection
                                id="contiguous"
                                title="1. Contiguous Allocation"
                                icon={AlignJustify}
                                imageSrc="/guide/contiguous.png"
                                description="Files must be stored in a single, unbroken line of contiguous blocks on the disk."
                                pros="Extremely fast sequential read performance (the disk head just reads straight across)."
                                cons="Suffers terribly from External Fragmentation. Over time, as files are created and deleted, gaps appear between files. Even if there are enough free blocks in total, if they aren't contiguous, a new large file cannot be saved."
                                testScenario={[
                                    "Set strategy to Contiguous.",
                                    <React.Fragment key="2">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File A</code> with a size of <strong>20KB</strong> (5 blocks).</React.Fragment>,
                                    <React.Fragment key="3">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File B</code> with a size of <strong>12KB</strong> (3 blocks).</React.Fragment>,
                                    <React.Fragment key="4">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File C</code> with a size of <strong>40KB</strong> (10 blocks).</React.Fragment>,
                                    "Look at the disk visualizer at the bottom. You will see three distinct blocks of data right next to each other.",
                                    <React.Fragment key="6">Now, <strong>Delete <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File B</code></strong>.</React.Fragment>,
                                    <React.Fragment key="7">Look at the disk visualizer. You will see a 3-block "gap" surrounded by <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File A</code> and <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File C</code>.</React.Fragment>,
                                    <React.Fragment key="8">Try to create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File D</code> with a size of <strong>16KB</strong> (4 blocks).</React.Fragment>,
                                    <React.Fragment key="9">You will notice <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File D</code> does not go into the gap left by <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File B</code> (because it's only 3 blocks wide and <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File D</code> needs 4). <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File D</code> is appended at the very end. The gap left by <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File B</code> is largely wasted space (external fragmentation).</React.Fragment>,
                                ]}
                            />

                            <StrategySection
                                id="linked"
                                title="2. Linked Allocation"
                                icon={Link2}
                                imageSrc="/guide/linked.png"
                                description="Files are stored as a linked list. Each block contains the user data and a pointer to the next block in the file."
                                pros="No external fragmentation. A file can grow perfectly into any available free blocks scattered across the disk."
                                cons="Poor random access performance (to read block 10, you must read blocks 1 through 9 to follow the pointers). Also wastes a tiny bit of space in each block for the pointer itself."
                                testScenario={[
                                    "Ensure your disk has the gap created in the previous test (or randomly create/delete files).",
                                    "Set strategy to Linked.",
                                    <React.Fragment key="3">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File E</code> with a size of <strong>40KB</strong> (10 blocks).</React.Fragment>,
                                    "Look at the disk visualizer. You will see the blocks for File E instantly fill any tiny scattered gaps available on the disk before appending the rest to the end.",
                                    <React.Fragment key="5">Click on <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File E</code> and look at the Inspector. Notice the "Allocated Blocks" section lists non-sequential block numbers (e.g., 5, 6, 7, 21, 22...).</React.Fragment>,
                                ]}
                            />

                            <StrategySection
                                id="indexed"
                                title="3. Indexed Allocation"
                                icon={ListTree}
                                imageSrc="/guide/indexed.png"
                                description={'Instead of blocks pointing to each other, an "Index Block" is maintained for each file. This special block contains an array of direct pointers to all the data blocks for that file.'}
                                pros="Excellent random access. No external fragmentation."
                                cons="Wasted space for small files (an entire index block must be allocated even for a 1-byte file). Also has a maximum file size limit based on how many pointers can fit in a single index block."
                                testScenario={[
                                    "Switch strategy to Indexed.",
                                    <React.Fragment key="2">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File X</code> with a tiny size of <strong>1KB</strong>.</React.Fragment>,
                                    "Look at the disk visualizer and the Inspector panel.",
                                    'Notice that even though the file is tiny, it actually takes up 2 blocks: 1 for the actual data, and 1 dedicated completely to being the "Index Block" which holds pointers.',
                                    <React.Fragment key="5">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File Y</code> with a size of <strong>40KB</strong> (10 blocks).</React.Fragment>,
                                    "The Inspector will show the same overhead: 1 Index Block + 10 Data Blocks. This visually demonstrates how Indexed allocation avoids external fragmentation (blocks can be scattered) but suffers from high internal metadata overhead for very small files."
                                ]}
                            />

                            <StrategySection
                                id="fat"
                                title="4. FAT (File Allocation Table)"
                                icon={Database}
                                imageSrc="/guide/fat.png"
                                description="A variant of linked allocation. Instead of pointers being inside the data blocks alongside your actual files, all pointers are pulled out and placed into a single, global table at the beginning of the disk (the FAT)."
                                pros="Because the FAT is heavily cached in RAM, finding the chain of blocks is incredibly fast without requiring disk reads, solving the random-access issue of standard Linked Allocation."
                                cons="The FAT takes up space permanently, and if the FAT gets corrupted, the entire file system is lost."
                                testScenario={[
                                    "Switch strategy to FAT.",
                                    <React.Fragment key="2">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File M</code> (12KB), <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File N</code> (16KB), and <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File O</code> (24KB).</React.Fragment>,
                                    <React.Fragment key="3">Now delete <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File N</code> to leave a 4-block gap.</React.Fragment>,
                                    <React.Fragment key="4">Create <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File P</code> (32KB). Like Linked and Indexed, it will intelligently fragment into the gap and append the rest.</React.Fragment>,
                                    <React.Fragment key="5">Look at the <strong>Inspector</strong> under the "OS Concept" note. Unlike standard Linked Allocation (where each scattered block must be sequentially physically read from disk to find the address of the next), here the directory entry <em>only</em> tracks the very first cluster. To find the rest of <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>File P</code>, the OS instantly reads a single global FAT table kept in memory, bypassing expensive disk jumps.</React.Fragment>,
                                ]}
                            />

                            <StrategySection
                                id="unix"
                                title="5. UNIX / Ext (Multi-level Indexed)"
                                icon={Layers}
                                imageSrc="/guide/unix.png"
                                description="A hybrid structure. The inode contains a mix of Direct Pointers (for small files), a Single Indirect Pointer (for medium files), a Double Indirect Pointer (for large files), and a Triple Indirect Pointer (for massive files)."
                                pros="Supremely efficient. Small files have zero overhead (direct pointers in the inode). Massive files can still be addressed easily."
                                cons="Highly complex to implement."
                                testScenario={[
                                    "Switch strategy to UNIX.",
                                    <React.Fragment key="2">Create a small file: <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>Small_File</code> with a size of <strong>4KB</strong> (1 block).</React.Fragment>,
                                    "Look at the disk and Inspector. Unlike basic Indexed allocation, there is 0 overhead for an index block! The pointer to this single data block fits directly right inside the Inode itself.",
                                    <React.Fragment key="4">Now, create a massive file: <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>Large_File</code> with a size of <strong>64KB</strong> (16 blocks).</React.Fragment>,
                                    'At this size, the file exceeds the typical 12 direct pointers that fit natively in a UNIX Inode. The OS dynamically allocates a "Single Indirect Block" to hold the remaining pointers. You\'ll see an extra block of overhead suddenly allocated just to hold these extended pointers. This hybrid approach keeps tiny files perfectly efficient (like Contiguous) while still supporting large ones (like Indexed).'
                                ]}
                            />

                            <div className="w-full mb-12 mt-20" style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' }} />

                            <GuideSection id="inspector" title="Exploring the Inspector">
                                <p className="mb-6">TriCoreFS simulates how classical OS path resolution works under the hood.</p>
                                <ol className="list-decimal list-outside ml-6 space-y-4" style={{ fontSize: '18px' }}>
                                    <li>Create a <strong style={{ color: '#000' }}>New Folder</strong> named <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>projects</code>.</li>
                                    <li>Inside <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>projects</code>, create another folder named <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>src</code>.</li>
                                    <li>Inside <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>src</code>, create a file <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>main.ts</code>.</li>
                                    <li>Click on <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>main.ts</code> and focus on the <strong style={{ color: '#000' }}>Path Resolution</strong> card in the Inspector on the right.</li>
                                    <li>
                                        You will see exactly how the OS resolves <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>/projects/src/main.ts</code> starting from Inode 0 (<code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>/</code>), looking up the block for <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>projects</code>, scanning its entries to find the inode for <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>src</code>, jumping to <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>src</code>'s block, and finally finding the inode for <code style={{ background: '#f3f4f6', padding: '2px 6px', fontSize: '15px' }}>main.ts</code>.
                                    </li>
                                </ol>
                            </GuideSection>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default Guide;
