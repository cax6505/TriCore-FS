/**
 * DirectoryTree Component
 * 
 * Displays the hierarchical structure of directories in a tree view.
 * Allows navigation and folder creation.
 */

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Directory, FileSystemState, ROOT_INODE_ID } from '@/types/filesystem';
import { ChevronDown, ChevronRight, Folder, FolderPlus } from 'lucide-react';
import { useState } from 'react';

interface DirectoryTreeProps {
  state: FileSystemState | null;
  selectedDirId: number;
  onSelectDirectory: (inodeId: number) => void;
  onCreateDirectory: (name: string) => void;
}

interface TreeNodeProps {
  state: FileSystemState;
  directory: Directory;
  name: string;
  level: number;
  selectedDirId: number;
  onSelectDirectory: (inodeId: number) => void;
  expandedDirs: Set<number>;
  toggleExpanded: (inodeId: number) => void;
}

import { AnimatePresence, motion } from 'framer-motion';

function TreeNode({
  state,
  directory,
  name,
  level,
  selectedDirId,
  onSelectDirectory,
  expandedDirs,
  toggleExpanded,
}: TreeNodeProps) {
  const isSelected = directory.inodeId === selectedDirId;
  const isExpanded = expandedDirs.has(directory.inodeId);
  
  // Get child directories
  const childDirs = directory.entries
    .filter(entry => {
      const inode = state.inodes.get(entry.inodeId);
      return inode?.type === 'directory';
    })
    .map(entry => ({
      name: entry.name,
      directory: state.directories.get(entry.inodeId)!,
    }))
    .filter(item => item.directory);

  const hasChildren = childDirs.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-1 tree-item ${isSelected ? 'tree-item-selected' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelectDirectory(directory.inodeId)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(directory.inodeId);
            }}
            className="p-0.5 hover:bg-accent rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <Folder className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm truncate">{name}</span>
      </div>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {childDirs.map(child => (
              <TreeNode
                key={child.directory.inodeId}
                state={state}
                directory={child.directory}
                name={child.name}
                level={level + 1}
                selectedDirId={selectedDirId}
                onSelectDirectory={onSelectDirectory}
                expandedDirs={expandedDirs}
                toggleExpanded={toggleExpanded}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DirectoryTree({
  state,
  selectedDirId,
  onSelectDirectory,
  onCreateDirectory,
}: DirectoryTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<number>>(new Set([ROOT_INODE_ID]));
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const toggleExpanded = (inodeId: number) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(inodeId)) {
        next.delete(inodeId);
      } else {
        next.add(inodeId);
      }
      return next;
    });
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateDirectory(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderDialog(false);
      // Expand the current directory to show the new folder
      setExpandedDirs(prev => new Set([...prev, selectedDirId]));
    }
  };

  if (!state) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  const rootDir = state.directories.get(ROOT_INODE_ID);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Directory Tree</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={() => setShowNewFolderDialog(true)}
          title="New Folder"
        >
          <FolderPlus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-1">
        {rootDir && (
          <TreeNode
            state={state}
            directory={rootDir}
            name="/"
            level={0}
            selectedDirId={selectedDirId}
            onSelectDirectory={onSelectDirectory}
            expandedDirs={expandedDirs}
            toggleExpanded={toggleExpanded}
          />
        )}
      </div>

      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
