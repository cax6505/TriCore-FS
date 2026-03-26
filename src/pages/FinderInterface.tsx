
import { Navbar } from "@/components/landing/Navbar";
import { useFileSystem } from "@/hooks/useFileSystem";
import { ROOT_INODE_ID } from "@/types/filesystem";
import { format } from "date-fns";
import {
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    Cloud,
    Download,
    FilePlus,
    FileText,
    Folder,
    FolderPlus,
    HardDrive,
    LayoutGrid,
    List,
    Monitor,
    Search,
    Trash2
} from "lucide-react";
import React, { useEffect, useState } from "react";



const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-1.5 text-[13px] rounded-md cursor-pointer transition-colors ${active ? "bg-gray-200 text-black font-medium" : "text-gray-600 hover:bg-gray-100"}`}
    >
        {icon}
        <span>{label}</span>
    </div>
);

const FileItem = ({
    name,
    type,
    size,
    date,
    onClick,
    onDoubleClick,
    onDelete
}: {
    name: string,
    type: "directory" | "file",
    size: string,
    date: string,
    onClick?: () => void,
    onDoubleClick?: () => void,
    onDelete?: (e: React.MouseEvent) => void
}) => {
    const isFolder = type === "directory";

    return (
        <div
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group text-center w-32 relative"
        >
            {}
            <button
                onClick={onDelete}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all z-10"
                title="Delete"
            >
                <Trash2 className="w-3 h-3" />
            </button>

            <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-105">
                {isFolder ? (
                    <Folder className="w-12 h-12 text-blue-400 fill-blue-400/20" strokeWidth={1.5} />
                ) : (
                    <FileText className="w-10 h-10 text-gray-500" strokeWidth={1.5} />
                )}
            </div>
            <div className="flex flex-col gap-0.5 w-full">
                <span className="text-[12px] font-medium text-black leading-tight break-words line-clamp-2 selection:bg-blue-200 w-full">
                    {name}
                </span>
                <span className="text-[10px] text-gray-400">{size}</span>
                <span className="text-[10px] text-gray-400">{date}</span>
            </div>
        </div>
    );
};

const FinderInterface = () => {
    
    const {
        state,
        currentDirectory,
        currentPath,
        selectDirectory,
        createDirectory,
        createFile,
        deleteEntry,
        selectedDirId
    } = useFileSystem('visual-fs-state-finder');

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState("");
    const [newFolderName, setNewFolderName] = useState("");
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);

    
    const [history, setHistory] = useState<number[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    
    useEffect(() => {
        if (state && history.length === 0) {
            setHistory([ROOT_INODE_ID]);
            setHistoryIndex(0);
        }
    }, [state, history.length]);

    const handleNavigate = (inodeId: number) => {
        if (inodeId === selectedDirId) return;

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(inodeId);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        selectDirectory(inodeId);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            selectDirectory(history[newIndex]);
        }
    };

    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            selectDirectory(history[newIndex]);
        }
    };

    const handleUp = () => {
        if (currentDirectory?.parentInodeId !== null && currentDirectory?.parentInodeId !== undefined) {
            handleNavigate(currentDirectory.parentInodeId);
        }
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            try {
                createDirectory(newFolderName.trim());
                setNewFolderName("");
                setShowNewFolderInput(false);
            } catch (e) {
                alert((e as Error).message);
            }
        }
    };

    
    const handleCreateDummyFile = () => {
        const name = `File ${Math.floor(Math.random() * 1000)}.txt`;
        try {
            createFile(name, 4); 
        } catch (e) {
            alert((e as Error).message);
        }
    };

    if (!state || !currentDirectory) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading File System...</div>;

    
    const entries = currentDirectory.entries.map(entry => {
        const inode = state.inodes.get(entry.inodeId);
        return {
            ...entry,
            inode
        };
    }).filter(e => e.inode && e.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const currentDirectoryName = currentDirectory.inodeId === ROOT_INODE_ID
        ? "Macintosh HD"
        : currentPath.split("/").filter(Boolean).at(-1) || currentPath;

    return (
        <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-blue-200 flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-6 md:p-10">

                {}
                <div className="w-full max-w-6xl h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500">

                    {}
                    <div className="h-14 bg-[#f3f4f6] border-b border-gray-200 flex items-center justify-between px-4 window-drag-region">
                        <div className="flex items-center gap-6">
                            {}
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:brightness-90 cursor-default" />
                                <div className="w-3 h-3 rounded-full bg-[#febc2e] border-[#d89e24] border hover:brightness-90 cursor-default" />
                                <div className="w-3 h-3 rounded-full bg-[#28c840] border-[#1aab29] border hover:brightness-90 cursor-default" />
                            </div>

                            {}
                            <div className="flex items-center gap-1 text-gray-500">
                                <button
                                    onClick={handleBack}
                                    disabled={historyIndex <= 0}
                                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleForward}
                                    disabled={historyIndex >= history.length - 1}
                                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleUp}
                                    disabled={currentDirectory.inodeId === ROOT_INODE_ID}
                                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 ml-2"
                                    title="Up one level"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>

                            <span className="font-semibold text-sm text-gray-700 truncate max-w-[200px]">
                                {currentDirectoryName}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            {}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowNewFolderInput(true)}
                                    className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600"
                                    title="New Folder"
                                >
                                    <FolderPlus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleCreateDummyFile}
                                    className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600"
                                    title="New File"
                                >
                                    <FilePlus className="w-4 h-4" />
                                </button>
                            </div>

                            {}
                            <div className="flex items-center bg-gray-200 rounded-md p-0.5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1 rounded shadow-sm ${viewMode === 'grid' ? 'bg-white' : 'hover:bg-gray-300'}`}
                                >
                                    <LayoutGrid className="w-4 h-4 text-gray-700" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1 rounded shadow-sm ${viewMode === 'list' ? 'bg-white' : 'hover:bg-gray-300'}`}
                                >
                                    <List className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {}
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8 pl-8 pr-3 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-32 md:w-48 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="flex-1 flex min-h-0">

                        {}
                        <div className="w-48 md:w-56 bg-[#f8f9fa]/80 backdrop-blur-xl border-r border-gray-200 p-3 flex flex-col gap-6 overflow-y-auto hidden sm:flex">

                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 px-3 mb-2">Locations</h4>
                                <div className="space-y-0.5">
                                    <SidebarItem
                                        icon={<HardDrive className="w-4 h-4 text-gray-500" />}
                                        label="Macintosh HD"
                                        active={currentDirectory.inodeId === ROOT_INODE_ID}
                                        onClick={() => handleNavigate(ROOT_INODE_ID)}
                                    />
                                    <SidebarItem icon={<Cloud className="w-4 h-4 text-blue-400" />} label="iCloud Drive" />
                                    <SidebarItem icon={<Monitor className="w-4 h-4 text-gray-600" />} label="Desktop" />
                                    <SidebarItem icon={<Download className="w-4 h-4 text-blue-500" />} label="Downloads" />
                                </div>
                            </div>

                            <div className="mt-auto px-3 pb-2 text-[10px] text-gray-400">
                                SaveSpace OS v1.0
                            </div>

                        </div>

                        {}
                        <div className="flex-1 bg-white overflow-y-auto p-4 content-start" onClick={() => setShowNewFolderInput(false)}>

                            {}
                            {showNewFolderInput && (
                                <div className="mb-4 p-4 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
                                    <Folder className="w-5 h-5 text-blue-400" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="New Folder Name"
                                        className="bg-white border px-2 py-1 text-sm rounded w-48"
                                        value={newFolderName}
                                        onChange={e => setNewFolderName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                                    />
                                    <button onClick={handleCreateFolder} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Create</button>
                                </div>
                            )}

                            {entries.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                    <Folder className="w-16 h-16 mb-4 opacity-20" />
                                    <span className="text-sm">Folder is empty</span>
                                </div>
                            ) : (
                                viewMode === "grid" ? (
                                    <div className="flex flex-wrap content-start gap-2">
                                        {entries.map((entry) => (
                                            <FileItem
                                                key={entry.inodeId}
                                                name={entry.name}
                                                type={entry.inode?.type === 'directory' ? 'directory' : 'file'}
                                                size={entry.inode?.size ? (entry.inode.size < 1024 ? `${entry.inode.size} B` : `${Math.round(entry.inode.size / 1024)} KB`) : "--"}
                                                date={entry.inode?.createdAt ? format(new Date(entry.inode.createdAt), 'MMM d, HH:mm') : ''}
                                                onClick={() => { }}
                                                onDoubleClick={() => {
                                                    if (entry.inode?.type === 'directory') {
                                                        handleNavigate(entry.inodeId);
                                                    }
                                                }}
                                                onDelete={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Are you sure you want to delete "${entry.name}"?`)) {
                                                        deleteEntry(entry.name);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
                                        {entries.map((entry) => {
                                            const formattedSize = entry.inode?.size
                                                ? (entry.inode.size < 1024 ? `${entry.inode.size} B` : `${Math.round(entry.inode.size / 1024)} KB`)
                                                : "--";
                                            const formattedDate = entry.inode?.createdAt
                                                ? format(new Date(entry.inode.createdAt), 'MMM d, HH:mm')
                                                : "--";

                                            return (
                                                <div
                                                    key={entry.inodeId}
                                                    onDoubleClick={() => {
                                                        if (entry.inode?.type === "directory") {
                                                            handleNavigate(entry.inodeId);
                                                        }
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                                >
                                                    {entry.inode?.type === "directory" ? (
                                                        <Folder className="w-5 h-5 text-blue-400 fill-blue-400/20 shrink-0" strokeWidth={1.5} />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={1.5} />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-gray-900 truncate">{entry.name}</p>
                                                        <p className="text-xs text-gray-500">{formattedSize}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 shrink-0">{formattedDate}</p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Are you sure you want to delete "${entry.name}"?`)) {
                                                                deleteEntry(entry.name);
                                                            }
                                                        }}
                                                        className="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            )}
                        </div>

                    </div>

                    {}
                    <div className="h-8 bg-[#f3f4f6] border-t border-gray-200 flex items-center justify-center text-[11px] text-gray-500 cursor-default select-none">
                        {entries.length} items, {state.disk.totalBlocks - state.disk.blocks.filter(b => b.used).length} blocks available
                    </div>

                </div>

            </main>
        </div>
    );
};

export default FinderInterface;
