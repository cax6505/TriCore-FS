import { Button } from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Directory, FileSystemState } from '@/types/filesystem';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, File, FilePlus, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FileGridProps {
  state: FileSystemState | null;
  currentDirectory: Directory | null;
  currentPath: string;
  onSelectFile: (inodeId: number, name: string) => void;
  onOpenDirectory: (inodeId: number) => void;
  onCreateFile: (name: string, sizeInKB: number) => void;
  onRenameEntry: (oldName: string, newName: string) => void;
  onDeleteEntry: (name: string) => void;
  selectedFileId: number | null;
}

export function FileGrid({
  state,
  currentDirectory,
  currentPath,
  onSelectFile,
  onOpenDirectory,
  onCreateFile,
  onRenameEntry,
  onDeleteEntry,
  selectedFileId,
}: FileGridProps) {
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('4');
  
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleCreateFile = () => {
    if (newFileName.trim() && newFileSize) {
      const size = parseInt(newFileSize, 10);
      if (size > 0) {
        onCreateFile(newFileName.trim(), size);
        setNewFileName('');
        setNewFileSize('4');
        setShowNewFileDialog(false);
      }
    }
  };

  const handleRename = () => {
    if (renameTarget && newName.trim()) {
      onRenameEntry(renameTarget, newName.trim());
      setRenameTarget(null);
      setNewName('');
      setShowRenameDialog(false);
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      onDeleteEntry(deleteTarget);
      setDeleteTarget(null);
      setShowDeleteDialog(false);
    }
  };

  const openRenameDialog = (name: string) => {
    setRenameTarget(name);
    setNewName(name);
    setShowRenameDialog(true);
  };

  const openDeleteDialog = (name: string) => {
    setDeleteTarget(name);
    setShowDeleteDialog(true);
  };

  if (!state || !currentDirectory) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        Select a directory
      </div>
    );
  }

  // Sort entries: directories first, then files
  const sortedEntries = [...currentDirectory.entries].sort((a, b) => {
    const inodeA = state.inodes.get(a.inodeId);
    const inodeB = state.inodes.get(b.inodeId);
    if (inodeA?.type === 'directory' && inodeB?.type !== 'directory') return -1;
    if (inodeA?.type !== 'directory' && inodeB?.type === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm pl-2">Files</span>
          <span className="text-xs text-muted-foreground font-mono">{currentPath}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={() => setShowNewFileDialog(true)}
          title="New File"
        >
          <FilePlus className="w-4 h-4" />
        </Button>
      </div>
      
      {sortedEntries.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm flex-1">
          This directory is empty
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            <AnimatePresence>
            {sortedEntries.map((entry) => {
              const inode = state.inodes.get(entry.inodeId);
          if (!inode) return null;

          const isDir = inode.type === 'directory';
          const isSelected = selectedFileId === entry.inodeId;

          return (
            <motion.div
              key={entry.inodeId}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <button
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-all w-full",
                      isSelected && "bg-accent ring-2 ring-primary shadow-sm",
                      !isSelected && "hover:shadow-md hover:-translate-y-1"
                    )}
                    onClick={() => {
                      if (isDir) {
                        onOpenDirectory(entry.inodeId);
                      } else {
                        onSelectFile(entry.inodeId, entry.name);
                      }
                    }}
                    onDoubleClick={() => {
                      if (isDir) {
                        onOpenDirectory(entry.inodeId);
                      }
                    }}
                  >
                    {isDir ? (
                      <Folder className="w-12 h-12 text-blue-500" fill="currentColor" fillOpacity={0.2} />
                    ) : (
                      <File className="w-12 h-12 text-gray-500" />
                    )}
                    <span className="text-xs text-center break-words line-clamp-2 w-full font-medium">
                      {entry.name}
                    </span>
                    {!isDir && (
                      <span className="text-[10px] text-muted-foreground font-mono mt-[-4px]">
                        {Math.ceil((inode?.size || 0) / 1024)}KB
                      </span>
                    )}
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => openRenameDialog(entry.name)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Rename
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => openDeleteDialog(entry.name)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </motion.div>
          );
        })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* New File Dialog */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                placeholder="example.txt"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setNewFileSize('4')}>
                    Small (4KB)
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setNewFileSize('64')}>
                    Med (64KB)
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setNewFileSize('300')}>
                    Large (300KB)
                  </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileSize">Size (KB)</Label>
              <Input
                id="fileSize"
                type="number"
                min="1"
                placeholder="4"
                value={newFileSize}
                onChange={(e) => setNewFileSize(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              />
              <p className="text-xs text-muted-foreground">
                Block size: 4KB. A {newFileSize}KB file uses {Math.ceil(parseInt(newFileSize || '0', 10) / 4)} blocks.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename "{renameTarget}"</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="New name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete "{deleteTarget}"?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              This will free the associated inode and disk blocks.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
