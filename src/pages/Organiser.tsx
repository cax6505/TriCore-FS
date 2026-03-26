import { Navbar } from "@/components/landing/Navbar";
import { ArrowLeft, ChevronRight, File as FileIcon, FileImage, FileText, FileType, FileVideo, Folder, HardDrive, LayoutGrid, List, UploadCloud, Headphones, FileSpreadsheet, Presentation, Archive, CheckCircle2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  size?: number;
  extension?: string;
  children?: FileNode[];
};

const formatSize = (bytes?: number) => {
  if (bytes === undefined) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }
  const kb = bytes / 1024;
  return `${Math.round(kb)} KB`;
};

const getIconForExtension = (ext?: string) => {
  if (!ext) return <FileIcon className="w-6 h-6 text-gray-400 font-light" strokeWidth={1.5} />;
  const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const vidExts = ['mp4', 'mov', 'avi', 'mkv'];
  const docExts = ['doc', 'docx', 'txt'];
  const pdfExts = ['pdf'];
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a'];
  const spreadsheetExts = ['xls', 'xlsx', 'csv'];
  const presentationExts = ['ppt', 'pptx'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];

  if (imgExts.includes(ext)) return <FileImage className="w-6 h-6 text-blue-500 font-light" strokeWidth={1.5} />;
  if (vidExts.includes(ext)) return <FileVideo className="w-6 h-6 text-purple-500 font-light" strokeWidth={1.5} />;
  if (docExts.includes(ext)) return <FileText className="w-6 h-6 text-green-600 font-light" strokeWidth={1.5} />;
  if (pdfExts.includes(ext)) return <FileText className="w-6 h-6 text-red-500 font-light" strokeWidth={1.5} />;
  
  if (audioExts.includes(ext)) return <Headphones className="w-6 h-6 text-orange-500 font-light" strokeWidth={1.5} />;
  if (spreadsheetExts.includes(ext)) return <FileSpreadsheet className="w-6 h-6 text-emerald-500 font-light" strokeWidth={1.5} />;
  if (presentationExts.includes(ext)) return <Presentation className="w-6 h-6 text-yellow-500 font-light" strokeWidth={1.5} />;
  if (archiveExts.includes(ext)) return <Archive className="w-6 h-6 text-indigo-500 font-light" strokeWidth={1.5} />;
  
  return <FileType className="w-6 h-6 text-gray-500 font-light" strokeWidth={1.5} />;
};

const parseDirectoryEntry = async (dirEntry: FileSystemDirectoryEntry, currentPath: string): Promise<FileNode> => {
  const dirReader = dirEntry.createReader();
  const children: FileNode[] = [];

  const readEntries = (): Promise<FileSystemEntry[]> => {
    return new Promise((resolve, reject) => {
      dirReader.readEntries(resolve, reject);
    });
  };

  let entries: FileSystemEntry[] = [];
  let readResult = await readEntries();
  while (readResult.length > 0) {
    entries.push(...readResult);
    readResult = await readEntries();
  }

  for (const entry of entries) {
    if (entry.isDirectory) {
      const subDir = await parseDirectoryEntry(entry as FileSystemDirectoryEntry, `${currentPath}/${entry.name}`);
      children.push(subDir);
    } else if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      const file = await new Promise<File>((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      children.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: 'file',
        path: `${currentPath}/${file.name}`,
        size: file.size,
        extension,
      });
    }
  }

  children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return {
    id: crypto.randomUUID(),
    name: dirEntry.name,
    type: 'folder',
    path: currentPath,
    children,
  };
};

export default function Organiser() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [organisedFolder, setOrganisedFolder] = useState<FileNode | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrganising, setIsOrganising] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  const [currentFolderList, setCurrentFolderList] = useState<FileNode[]>([]);
  const [navigationPath, setNavigationPath] = useState<FileNode[]>([]);

  useEffect(() => {
    if (fileTree && !activeSidebarItem) {
      setActiveSidebarItem('fileTree');
      navigateToFileTree(fileTree);
    } else if (!fileTree && !organisedFolder) {
      setCurrentFolderList([]);
      setNavigationPath([]);
      setActiveSidebarItem(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileTree, organisedFolder]);

  const navigateToFileTree = (tree: FileNode) => {
    setCurrentFolderList(tree.children || []);
    setNavigationPath([tree]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (isUploaded || isProcessing) return;

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    let dirEntry: FileSystemDirectoryEntry | null = null;
    
    for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (entry && entry.isDirectory) {
            dirEntry = entry as FileSystemDirectoryEntry;
            break;
        }
    }

    if (dirEntry) {
      setIsProcessing(true);
      try {
        const rootNode = await parseDirectoryEntry(dirEntry, dirEntry.name);
        setFileTree(rootNode);
        setIsUploaded(true);
      } catch (error) {
        console.error("Error reading directory:", error);
        toast.error("Failed to read the directory.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast.error("Please drop a single folder.");
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || isUploaded || isProcessing) return;

    setIsProcessing(true);
    try {
      // Build a tree from the flattened file list
      const rootEntries: Record<string, any> = {};
      let rootFolderName = "";

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const pathParts = file.webkitRelativePath.split('/');
        
        if (rootFolderName === "") {
          rootFolderName = pathParts[0];
        }

        let currentLevel = rootEntries;
        // Construct the tree structure from the paths
        for (let j = 1; j < pathParts.length; j++) {
          const part = pathParts[j];
          if (j === pathParts.length - 1) {
            // It's a file
            currentLevel[part] = {
              id: crypto.randomUUID(),
              name: file.name,
              type: 'file',
              path: file.webkitRelativePath,
              size: file.size,
              extension: file.name.split('.').pop()?.toLowerCase() || '',
            };
          } else {
            // It's a folder
            if (!currentLevel[part]) {
              currentLevel[part] = {
                isDirectory: true,
                children: {}
              };
            }
            currentLevel = currentLevel[part].children;
          }
        }
      }

      // Convert the object tree to the FileNode array tree
      const convertToNode = (name: string, obj: any, currentPath: string): FileNode => {
        if (obj.isDirectory) {
          const children: FileNode[] = [];
          for (const key in obj.children) {
            children.push(convertToNode(key, obj.children[key], `${currentPath}/${key}`));
          }
          children.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
            return a.name.localeCompare(b.name);
          });
          return {
            id: crypto.randomUUID(),
            name,
            type: 'folder',
            path: currentPath,
            children
          };
        } else {
          return obj as FileNode;
        }
      };

      const children: FileNode[] = [];
      for (const key in rootEntries) {
        children.push(convertToNode(key, rootEntries[key], `${rootFolderName}/${key}`));
      }
      
      children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      const rootNode: FileNode = {
        id: crypto.randomUUID(),
        name: rootFolderName,
        type: 'folder',
        path: rootFolderName,
        children
      };

      setFileTree(rootNode);
      setIsUploaded(true);
    } catch (error) {
      console.error("Error reading directory from input:", error);
      toast.error("Failed to read the directory.");
    } finally {
      setIsProcessing(false);
      // Reset input value to allow uploading the same folder again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const traverseToFolder = (node: FileNode) => {
    if (node.type === 'folder') {
      setCurrentFolderList(node.children || []);
      const index = navigationPath.findIndex(p => p.id === node.id);
      if (index !== -1) {
        setNavigationPath(navigationPath.slice(0, index + 1));
      } else {
        setNavigationPath([...navigationPath, node]);
      }
    }
  };

  const goBack = () => {
    if (navigationPath.length > 1) {
      const newPath = [...navigationPath];
      newPath.pop();
      const parentNode = newPath[newPath.length - 1];
      setCurrentFolderList(parentNode.children || []);
      setNavigationPath(newPath);
    }
  };

  const handleReset = () => {
    setFileTree(null);
    setOrganisedFolder(null);
    setIsUploaded(false);
    setCurrentFolderList([]);
    setNavigationPath([]);
    setActiveSidebarItem(null);
  };

  const countFiles = (node: FileNode): number => {
    if (node.type === 'file') return 1;
    if (!node.children) return 0;
    return node.children.reduce((acc, child) => acc + countFiles(child), 0);
  };
  const totalFiles = fileTree ? countFiles(fileTree) : 0;

  const handleOrganise = () => {
    if (!fileTree || isOrganising) return;
    setIsOrganising(true);

    setTimeout(() => {
      const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      const pdfExts = ['pdf'];
      const vidExts = ['mp4', 'mov', 'avi', 'mkv'];
      const docExts = ['doc', 'docx', 'txt'];
      const audioExts = ['mp3', 'wav', 'ogg', 'm4a'];
      const spreadsheetExts = ['xls', 'xlsx', 'csv'];
      const presentationExts = ['ppt', 'pptx'];
      const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];

      const categories: Record<string, FileNode[]> = {
        images: [],
        pdfs: [],
        videos: [],
        audio: [],
        spreadsheets: [],
        presentations: [],
        documents: [],
        archives: [],
        others: []
      };

      const collectFiles = (node: FileNode) => {
        if (node.type === 'file') {
          const ext = node.extension || '';
          if (imgExts.includes(ext)) {
            categories.images.push({...node, id: crypto.randomUUID()});
          } else if (pdfExts.includes(ext)) {
            categories.pdfs.push({...node, id: crypto.randomUUID()});
          } else if (vidExts.includes(ext)) {
            categories.videos.push({...node, id: crypto.randomUUID()});
          } else if (docExts.includes(ext)) {
            categories.documents.push({...node, id: crypto.randomUUID()});
          } else if (audioExts.includes(ext)) {
            categories.audio.push({...node, id: crypto.randomUUID()});
          } else if (spreadsheetExts.includes(ext)) {
            categories.spreadsheets.push({...node, id: crypto.randomUUID()});
          } else if (presentationExts.includes(ext)) {
            categories.presentations.push({...node, id: crypto.randomUUID()});
          } else if (archiveExts.includes(ext)) {
            categories.archives.push({...node, id: crypto.randomUUID()});
          } else {
            categories.others.push({...node, id: crypto.randomUUID()});
          }
        } else if (node.children) {
          node.children.forEach(collectFiles);
        }
      };

      collectFiles(fileTree);

      const organisedNode: FileNode = {
        id: crypto.randomUUID(),
        name: 'organised',
        type: 'folder',
        path: 'organised',
        children: Object.entries(categories)
          .filter(([, files]) => files.length > 0)
          .map(([catName, files]) => ({
            id: crypto.randomUUID(),
            name: catName,
            type: 'folder',
            path: `organised/${catName}`,
            children: files
          }))
      };

      setOrganisedFolder(organisedNode);
      setIsOrganising(false);
      
      toast.success("Files successfully organised!", { 
        icon: (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12.5l3 3 5-6" />
          </svg>
        ),
        className: "font-medium text-gray-900",
      });
      
      // Auto-navigate to organised folder
      setActiveSidebarItem('organisedFolder');
      navigateToFileTree(organisedNode);
    }, 2000); // Increased UI delay to showcase custom overlay animation
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-blue-200 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 md:p-10">

        {/* Main Window */}
        <div className="w-full max-w-6xl h-[80vh] relative bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500">

          {isOrganising && (
            <div className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-[2px] flex items-center justify-center flex-col animate-in fade-in duration-300">
               <div className="relative mb-6">
                  <svg className="w-16 h-16 animate-spin text-blue-500" viewBox="0 0 50 50">
                    <circle className="text-blue-100" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
                    <circle 
                      cx="25" cy="25" r="20" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeLinecap="round"
                      strokeDasharray="90 150"
                      className="text-blue-500"
                    />
                  </svg>
               </div>
               <h3 className="text-xl font-bold text-gray-800">Organising your files</h3>
               <p className="text-sm text-gray-500 mt-2 pb-10 font-medium">Categorizing by file type..</p>
            </div>
          )}

          {/* Header Bar */}
          <div className="h-14 bg-[#f3f4f6] border-b border-gray-200 flex items-center justify-between px-4 window-drag-region shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:brightness-90 cursor-default" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border-[#d89e24] border hover:brightness-90 cursor-default" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border-[#1aab29] border hover:brightness-90 cursor-default" />
              </div>
              
              <div className="flex items-center gap-1 text-gray-500">
                <button 
                  onClick={goBack} 
                  disabled={navigationPath.length <= 1}
                  className={`p-1 rounded ${navigationPath.length <= 1 ? 'opacity-30' : 'hover:bg-gray-200'}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Breadcrumbs */}
              <div className="flex items-center text-[13px] font-semibold text-gray-700 flex-1 min-w-0 pr-4">
                {navigationPath.map((node, i) => (
                  <React.Fragment key={node.id}>
                    <button 
                      className="hover:bg-gray-200 px-1.5 py-0.5 rounded transition-colors truncate max-w-[150px]"
                      onClick={() => traverseToFolder(node)}
                    >
                      {node.name}
                    </button>
                    {i < navigationPath.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isUploaded && (
                <div className="flex bg-gray-200/50 p-0.5 rounded-md border border-gray-200/60 mr-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <button 
                onClick={handleReset}
                className="px-3 py-1.5 text-[12px] font-medium bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center gap-1.5 text-gray-600 transition-colors"
                disabled={!isUploaded}
              >
                Reset
              </button>
              <button 
                onClick={handleOrganise}
                className={`px-4 py-1.5 text-[12px] font-medium border rounded shadow-sm transition-all flex items-center gap-1.5
                    ${!isUploaded || isProcessing || isOrganising 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'}`
                }
                disabled={!isUploaded || isProcessing || isOrganising || !!organisedFolder}
              >
                Organise
              </button>
            </div>
          </div>

          <div className="flex-1 flex min-h-0 bg-white">
            {/* Sidebar */}
            <div className="w-48 md:w-56 bg-[#f8f9fa]/80 backdrop-blur-xl border-r border-gray-200 p-4 flex flex-col gap-6 overflow-y-auto hidden sm:flex shrink-0">
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 px-3 mb-2">Locations</h4>
                <div className="space-y-1">
                  <div
                    onClick={() => {
                      if (fileTree) {
                        setActiveSidebarItem('fileTree');
                        navigateToFileTree(fileTree);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-[13px] rounded-md transition-colors font-medium
                      ${activeSidebarItem === 'fileTree' ? 'bg-black/5 text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]' : (fileTree ? 'text-gray-600 hover:bg-gray-100 cursor-pointer' : 'text-gray-400 cursor-default')}`}
                  >
                    <div className="w-5 flex justify-center">
                      <HardDrive className={`w-4 h-4 ${activeSidebarItem === 'fileTree' ? 'text-gray-700' : (fileTree ? 'text-gray-500' : 'text-gray-300')}`} />
                    </div>
                    <span>{fileTree ? fileTree.name : 'Local Disk'}</span>
                  </div>
                  {organisedFolder && (
                    <div
                      onClick={() => {
                        setActiveSidebarItem('organisedFolder');
                        navigateToFileTree(organisedFolder);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 text-[13px] rounded-md transition-colors cursor-pointer font-medium
                        ${activeSidebarItem === 'organisedFolder' ? 'bg-black/5 text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <div className="w-5 flex justify-center">
                        <Folder className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                      </div>
                      <span>Organised</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-auto px-3 pb-2 text-[10px] text-gray-400">
                  SaveSpace OS v1.0
              </div>
            </div>

            {/* Content Display */}
            <div 
              className={`flex-1 overflow-y-auto w-full transition-all duration-200`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {!isUploaded ? (
                <div className="h-full w-full p-8 flex items-center justify-center">
                  <div 
                    className={`border-2 border-dashed rounded-xl max-w-xl w-full min-h-[400px] flex items-center justify-center flex-col gap-6 transition-all duration-300
                      ${isProcessing ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-[#fafafa] text-gray-500 hover:border-gray-400 hover:bg-gray-50'}`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                        <div className="text-center">
                          <p className="font-semibold text-blue-900 text-sm">Reading directory structure...</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Folder className="w-14 h-14 text-blue-400 fill-blue-400/20" />
                        <div className="text-center flex flex-col items-center">
                          <p className="font-semibold text-gray-700">Drop a folder to explore</p>
                          <p className="text-xs text-gray-500 mt-1 mb-5 px-4 text-center">
                            Only one folder upload supported at a time.
                          </p>
                          
                          <input 
                            type="file" 
                            hidden 
                            ref={fileInputRef}
                            onChange={handleFileInput}
                            // @ts-expect-error Supported in modern browsers for directory selection
                            webkitdirectory="true"
                            directory="true"
                            multiple
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2 mx-auto transition-colors"
                          >
                            <UploadCloud className="w-4 h-4" />
                            Browse Folder
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className={viewMode === "list" ? "" : "p-4"}>
                  {currentFolderList.length === 0 ? (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-gray-400">
                      <Folder className="w-16 h-16 mb-4 opacity-20" />
                      <span className="text-sm">Folder is empty</span>
                    </div>
                  ) : viewMode === "list" ? (
                    <div className="divide-y divide-gray-100 overflow-hidden text-sm">
                      {currentFolderList.map((node) => (
                        <div 
                          key={node.id}
                          className={`grid grid-cols-[24px_1fr_80px_24px] items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors
                            ${node.type === 'folder' ? 'cursor-pointer' : 'cursor-default'}`}
                          onClick={() => node.type === 'folder' && traverseToFolder(node)}
                        >
                          <div className="flex justify-center w-6 opacity-80">
                            {node.type === 'folder' ? (
                              <Folder className="w-5 h-5 text-blue-400 fill-blue-400/20" strokeWidth={1.5} />
                            ) : (
                              getIconForExtension(node.extension)
                            )}
                          </div>
                          <div className="min-w-0 pr-4">
                            <p className="text-gray-900 truncate font-medium">{node.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 tabular-nums">
                              {node.type === 'file' ? formatSize(node.size) : (node.children ? `${node.children.length} items` : '--')}
                            </p>
                          </div>
                          <div className="flex justify-end text-gray-400">
                            {node.type === 'folder' && <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6 pb-6 p-2">
                      {currentFolderList.map((node) => (
                        <div
                          key={node.id}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors text-center group
                            ${node.type === 'folder' ? 'cursor-pointer' : 'cursor-default'}`}
                          onClick={() => node.type === 'folder' && traverseToFolder(node)}
                        >
                          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200 relative">
                            {node.type === 'folder' ? (
                              <Folder className="w-8 h-8 text-blue-400 fill-blue-400/20 transition-transform group-hover:scale-105" strokeWidth={1.5} />
                            ) : (
                              <div className="transition-transform group-hover:scale-105">
                                {getIconForExtension(node.extension)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center w-full px-1">
                            <p className="text-[13px] text-gray-800 font-medium truncate w-full">{node.name}</p>
                            <p className="text-[11px] text-gray-400 mt-[2px]">
                               {node.type === 'file' ? formatSize(node.size) : (node.children ? `${node.children.length} items` : '--')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Footer Bar */}
          <div className="h-8 bg-[#f3f4f6] border-t border-gray-200 flex items-center justify-center text-[11px] text-gray-500 cursor-default select-none">
            {fileTree ? `${totalFiles} items analyzed` : "0 items analyzed"}
          </div>

        </div>
      </main>
    </div>
  );
}
