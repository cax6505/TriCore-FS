/**
 * FileInspector Component
 * 
 * Displays detailed metadata about the selected file.
 * Shows inode information and allocated disk blocks.
 */

import { InodePointerVisualization } from '@/components/InodePointerVisualization';
import { PathVisualizer } from '@/components/PathVisualizer';
import { PermissionEditor } from '@/components/PermissionEditor';
import { Badge } from '@/components/ui/badge';
import { BLOCK_SIZE, FileSystemState, Inode, PermissionSet } from '@/types/filesystem';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, File, Folder, HardDrive, Hash, LayoutGrid, Shield } from 'lucide-react';

interface FileInspectorProps {
  selectedFile: Inode | null;
  selectedFileName: string | null;
  state: FileSystemState | null;
  path: string | null;
  onUpdatePermissions: (inodeId: number, permissions: PermissionSet) => void;
}

export function FileInspector({ selectedFile, selectedFileName, state, path, onUpdatePermissions }: FileInspectorProps) {
  if (!selectedFile || !selectedFileName) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <span>Inspector</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select a file to inspect
        </div>
      </div>
    );
  }

  const isDir = selectedFile.type === 'directory';
  const createdDate = new Date(selectedFile.createdAt);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span>Inspector</span>
      </div>
      
      <div className="flex-1 overflow-auto overflow-x-hidden p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFile.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="space-y-6"
          >
            {/* File icon and name */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded">
                {isDir ? (
                  <Folder className="w-8 h-8 text-foreground" />
                ) : (
                  <File className="w-8 h-8 text-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedFileName}</h3>
                <p className="text-sm text-muted-foreground capitalize">{selectedFile.type}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Inode Number</p>
                  <p className="font-mono">{selectedFile.id}</p>
                </div>
              </div>

              {!isDir && (
                <div className="flex items-start gap-3">
                  <HardDrive className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Size</p>
                    <p className="font-mono">
                      {selectedFile.size} bytes ({Math.ceil(selectedFile.size / 1024)} KB)
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Created</p>
                  <p className="font-mono text-sm">
                    {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <PermissionEditor
                     permissions={selectedFile.permissions}
                     onChange={(newPerms) => onUpdatePermissions(selectedFile.id, newPerms)}
                  />
                </div>
              </div>

              {selectedFile.allocationStrategy && (
                <div className="flex items-start gap-3">
                  <LayoutGrid className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Strategy</p>
                    <Badge variant="secondary" className="text-[10px] uppercase font-mono px-1 py-0 h-5 mt-0.5">
                      {selectedFile.allocationStrategy}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            
            {/* Inode Pointer Visualization (Feature 2) */}
            {!isDir && <InodePointerVisualization inode={selectedFile} />}

            {/* Path Visualization (Feature 3) */}
            <PathVisualizer state={state} path={path} />

            {/* Block Pointers */}
            {!isDir && (
              <div className="pt-2 border-t">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                  Allocated Blocks ({selectedFile.blockPointers.length})
                </h4>
                
                {selectedFile.blockPointers.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      <AnimatePresence>
                        {selectedFile.blockPointers.map((blockId, index) => (
                          <motion.div
                            key={`${selectedFile.id}-block-${blockId}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-2 py-1 bg-block-selected text-primary-foreground text-xs font-mono rounded"
                          >
                            {blockId}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total: {selectedFile.blockPointers.length * BLOCK_SIZE / 1024} KB allocated
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No blocks allocated</p>
                )}
              </div>
            )}

            {/* OS Concept Note */}
            <div className="pt-2 border-t">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                OS Concept
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isDir ? (
                  <>
                    Directories are special files that contain name→inode mappings.
                    The directory itself doesn't store file data—it only points to inodes.
                  </>
                ) : selectedFile.allocationStrategy === 'fat' ? (
                  <>
                    In FAT, the directory entry stores only the <strong>first cluster</strong> number.
                    All subsequent clusters are found by following the chain in the global
                    File Allocation Table — no per-block pointers needed inside the data blocks.
                  </>
                ) : (
                  <>
                    File names are NOT stored in inodes. The name exists only in the
                    parent directory's entry table. This enables hard links: multiple
                    names pointing to one inode.
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
