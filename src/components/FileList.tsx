/**
 * FileList Component
 * 
 * Displays files and folders in the currently selected directory.
 * Provides CRUD operations: create, rename, delete files.
 */

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Directory, FileSystemState } from '@/types/filesystem';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, File, FilePlus, Folder, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FileListProps {
  state: FileSystemState | null;
  currentDirectory: Directory | null;
  currentPath: string;
  selectedFileId: number | null;
  onSelectFile: (inodeId: number) => void;
  onSelectDirectory: (inodeId: number) => void;
  onCreateFile: (name: string, sizeInKB: number) => void;
  onRenameEntry: (oldName: string, newName: string) => void;
  onDeleteEntry: (name: string) => void;
}

export function FileList({
  state,
  currentDirectory,
  currentPath,
  selectedFileId,
  onSelectFile,
  onSelectDirectory,
  onCreateFile,
  onRenameEntry,
  onDeleteEntry,
}: FileListProps) {
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  
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
      <div className="p-4 text-muted-foreground text-sm">
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
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Files</span>
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

      <div className="flex-1 overflow-auto">
        {sortedEntries.length === 0 ? (
          <div className="p-4 text-muted-foreground text-sm text-center">
            Empty directory
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="border-b">
                <th className="text-left px-3 py-2 font-medium">Name</th>
                <th className="text-left px-3 py-2 font-medium w-20">Size</th>
                <th className="text-left px-3 py-2 font-medium w-20">Inode</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
              {sortedEntries.map(entry => {
                const inode = state.inodes.get(entry.inodeId);
                if (!inode) return null;
                
                const isSelected = entry.inodeId === selectedFileId;
                const isDir = inode.type === 'directory';
                
                return (
                  <motion.tr
                    key={entry.inodeId}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`border-b cursor-pointer hover:bg-item-hover ${
                      isSelected ? 'bg-item-selected' : ''
                    }`}
                    onClick={() => {
                      if (isDir) {
                        onSelectDirectory(entry.inodeId);
                      } else {
                        onSelectFile(entry.inodeId);
                      }
                    }}
                    onDoubleClick={() => {
                      if (isDir) {
                        onSelectDirectory(entry.inodeId);
                      }
                    }}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {isDir ? (
                          <Folder className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <File className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span>{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {isDir ? '-' : `${Math.ceil(inode.size / 1024)}KB`}
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {inode.id}
                    </td>
                    <td className="px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openRenameDialog(entry.name)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(entry.name)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                );
              })}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

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
