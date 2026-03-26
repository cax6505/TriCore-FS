
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Database, FileDigit, GitBranch, HardDrive, Layers } from "lucide-react";
import React from "react";



const SectionLabel = ({ children }: { children: string }) => (
    <span
        className="inline-flex items-center gap-2 text-[11px] font-bold text-black uppercase mb-5"
        style={{ letterSpacing: "1.5px" }}
    >
        <span className="w-[6px] h-[6px] bg-black inline-block" />
        {children}
    </span>
);

const ConceptCard = ({
    icon,
    title,
    description,
    children
}: {
    icon: React.ReactNode,
    title: string,
    description: string,
    children?: React.ReactNode
}) => (
    <div className="border border-black p-8 bg-white h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
            <div className="p-3 bg-black text-white rounded-none">
                {icon}
            </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 leading-tight">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
            {description}
        </p>
        <div className="mt-auto pt-6 border-t border-gray-100">
            {children}
        </div>
    </div>
);

const Theory = () => {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100">
                <Navbar />

                <main className="pt-32 pb-20">

                    {}
                    <section className="px-6 md:px-10 mb-20">
                        <div className="max-w-[1400px] mx-auto">
                            <SectionLabel>OPERATING SYSTEMS</SectionLabel>
                            <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
                                Understanding the <br /> File System
                            </h1>
                            <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                                SaveSpace simulates a UNIX-like file system in your browser.
                                Learn how your OS actually stores data, manages blocks, and handles fragmentation.
                            </p>
                        </div>
                    </section>

                    {}
                    <section className="px-6 md:px-10 mb-32">
                        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            <ConceptCard
                                icon={<FileDigit className="w-6 h-6" />}
                                title="Inodes & Metadata"
                                description="A file isn't just data—it's structure. The Inode (Index Node) stores metadata like permissions, owner, size, and pointers to the actual data blocks."
                            >
                                <div className="font-mono text-[10px] bg-gray-50 p-4 border border-gray-100 uppercase">
                                    <div>Inode: 1024</div>
                                    <div>Type: FILE</div>
                                    <div>Size: 4096B</div>
                                    <div>Blocks: [12, 13, 15]</div>
                                </div>
                            </ConceptCard>

                            <ConceptCard
                                icon={<Layers className="w-6 h-6" />}
                                title="Block Allocation"
                                description="Disks are divided into fixed-size chunks called Blocks. A 10KB file needs three 4KB blocks. The last block often has wasted space (Internal Fragmentation)."
                            >
                                <div className="flex gap-1 mt-2">
                                    <div className="h-8 flex-1 bg-black text-white flex items-center justify-center text-[10px] font-bold">4KB</div>
                                    <div className="h-8 flex-1 bg-black text-white flex items-center justify-center text-[10px] font-bold">4KB</div>
                                    <div className="h-8 flex-1 bg-gray-200 text-gray-400 flex items-center justify-center text-[10px] font-bold">2KB</div>
                                </div>
                                <div className="text-[10px] text-center mt-2 text-gray-400 font-mono uppercase">Internal Frag: 2KB</div>
                            </ConceptCard>

                            <ConceptCard
                                icon={<HardDrive className="w-6 h-6" />}
                                title="External Fragmentation"
                                description="Deleting files creates gaps. New large files might not fit in these small gaps, forcing the OS to scatter the file across the disk."
                            >
                                <div className="flex gap-0.5 mt-4">
                                    <div className="w-4 h-4 bg-black" />
                                    <div className="w-4 h-4 bg-black" />
                                    <div className="w-4 h-4 bg-white border border-gray-200" />
                                    <div className="w-4 h-4 bg-black" />
                                    <div className="w-4 h-4 bg-white border border-gray-200" />
                                    <div className="w-4 h-4 bg-black" />
                                </div>
                            </ConceptCard>

                        </div>
                    </section>

                    {}
                    <section className="px-6 md:px-10 mb-32">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="mb-12">
                                <h2 className="text-4xl font-medium tracking-tight mb-4">Allocation Strategies</h2>
                                <p className="text-gray-500 max-w-xl">
                                    How does the OS decide which blocks to pick? SaveSpace simulates three classic algorithms.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-l border-black">

                                {}
                                <div className="border-r border-b border-black p-10 hover:bg-gray-50 transition-colors group">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">1</span>
                                        Contiguous
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                        Files are stored in sequential blocks.
                                        <br /><br />
                                        <strong>Pros:</strong> Fastest read/write (head seek time minimal).
                                        <br />
                                        <strong>Cons:</strong> Severe external fragmentation. Hard to grow files.
                                    </p>
                                    <div className="bg-gray-100 h-2 w-full rounded-full overflow-hidden">
                                        <div className="bg-black w-3/4 h-full" />
                                    </div>
                                </div>

                                {}
                                <div className="border-r border-b border-black p-10 hover:bg-gray-50 transition-colors group">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">2</span>
                                        Linked
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                        Each block points to the next, like a linked list.
                                        <br /><br />
                                        <strong>Pros:</strong> No external fragmentation. Easy to grow.
                                        <br />
                                        <strong>Cons:</strong> Slow random access (must traverse list).
                                    </p>
                                    <div className="flex items-center gap-1 justify-center mt-2 opacity-50">
                                        <GitBranch className="w-4 h-4" />
                                        <div className="w-4 h-[1px] bg-black" />
                                        <GitBranch className="w-4 h-4" />
                                    </div>
                                </div>

                                {}
                                <div className="border-r border-b border-black p-10 hover:bg-gray-50 transition-colors group">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">3</span>
                                        Indexed (UNIX)
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                        A special "Index Block" stores pointers to all data blocks.
                                        <br /><br />
                                        <strong>Pros:</strong> Fast random access. No external fragmentation.
                                        <br />
                                        <strong>Cons:</strong> Wastes space for index block on small files.
                                    </p>
                                    <div className="flex justify-center mt-2 opacity-50">
                                        <Database className="w-6 h-6" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                </main>
                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default Theory;
