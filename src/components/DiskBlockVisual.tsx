/**
 * DiskBlockVisual Component
 * 
 * Visualizes the disk as a grid of blocks.
 * Shows free/used state and highlights blocks belonging to selected file.
 */

import { BLOCK_SIZE, Disk, Inode } from '@/types/filesystem';
import { motion } from 'framer-motion';

interface DiskBlockVisualProps {
  disk: Disk | null;
  selectedFile: Inode | null;
  diskStats: {
    totalBlocks: number;
    usedBlocks: number;
    freeBlocks: number;
    totalSizeKB: number;
    usedSizeKB: number;
    freeSizeKB: number;
  } | null;
  fragmentation: number;
}

export function DiskBlockVisual({ disk, selectedFile, diskStats, fragmentation }: DiskBlockVisualProps) {
  if (!disk || !diskStats) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        Loading disk...
      </div>
    );
  }

  const selectedBlockIds = new Set(selectedFile?.blockPointers ?? []);
  
  // Also include the index block if it exists (for indexed allocation)
  if (selectedFile?.indexBlockId !== null && selectedFile?.indexBlockId !== undefined) {
    selectedBlockIds.add(selectedFile.indexBlockId);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Disk Blocks</span>
        <div className="flex items-center gap-4 text-xs font-normal normal-case tracking-normal">
          <span>
            <span className="font-mono">{diskStats.usedBlocks}</span> used
          </span>
          <span>
            <span className="font-mono">{diskStats.freeBlocks}</span> free
          </span>
          <span>
            Block size: <span className="font-mono">{BLOCK_SIZE / 1024}KB</span>
          </span>
          {/* <span className={fragmentation > 30 ? "text-red-500 font-medium" : ""}>
            Frag: <span className="font-mono">{fragmentation}%</span>
          </span> */}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-block-border bg-block-free" />
            <span>Free</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-block-border bg-block-used" />
            <span>Used</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-block-border bg-block-selected" />
            <span>Selected File</span>
          </div>
          {(selectedFile?.allocationStrategy === 'indexed' || selectedFile?.allocationStrategy === 'unix') && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary bg-indigo-100 dark:bg-indigo-900" />
              <span>Index Block</span>
            </div>
          )}
          {selectedFile?.allocationStrategy === 'linked' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono border px-1 rounded">1→2</span>
              <span>Link Order</span>
            </div>
          )}
          {selectedFile?.allocationStrategy === 'fat' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono border border-orange-400 px-1 rounded text-orange-700 dark:text-orange-300">FAT</span>
              <span>FAT Chain</span>
            </div>
          )}
        </div>

        {/* Block Grid */}
        <div className="flex flex-wrap gap-1">
          {disk.blocks.map((block) => {
            const isSelected = selectedBlockIds.has(block.id);
            const isUsed = block.used;
            
            let blockClass = 'disk-block flex items-center justify-center text-[10px] font-mono transition-colors';
            let content = null;
            let animationDelay = 0;
            
            if (isSelected) {
              blockClass += ' bg-block-selected text-white ring-1 ring-white/20 shadow-sm';
              
              if (selectedFile?.allocationStrategy === 'indexed' || selectedFile?.allocationStrategy === 'unix') {
                if (block.blockType === 'index' || block.id === selectedFile.indexBlockId) {
                  blockClass = 'disk-block flex items-center justify-center text-[10px] font-mono transition-colors border-2 border-primary bg-indigo-100 text-indigo-900 font-bold';
                  content = 'IDX';
                  animationDelay = 0; // Index block appears first
                } else {
                  animationDelay = 0.2 + (Math.random() * 0.2); // Data blocks pop in after
                }
              } else if (selectedFile?.allocationStrategy === 'linked') {
                 // Find index in block pointers
                 const index = selectedFile.blockPointers.indexOf(block.id);
                 if (index !== -1) {
                   content = index + 1;
                   animationDelay = index * 0.1; // Sequential animation
                 }
              } else if (selectedFile?.allocationStrategy === 'fat') {
                // Show cluster chain position for FAT allocation
                const index = selectedFile.blockPointers.indexOf(block.id);
                if (index !== -1) {
                  blockClass = 'disk-block flex items-center justify-center text-[10px] font-mono transition-colors border-2 border-orange-400 bg-orange-100 text-orange-900 font-bold dark:bg-orange-900 dark:text-orange-100';
                  content = index + 1;
                  animationDelay = index * 0.08; // Sequential, slightly faster
                }
              } else {
                // Contiguous or default
                const index = selectedFile?.blockPointers.indexOf(block.id) ?? 0;
                animationDelay = Math.max(0, index) * 0.05; // Fast sequential wave
              }
            } else if (isUsed) {
              blockClass += ' bg-block-used';
            } else {
              blockClass += ' bg-block-free';
            }
            
            return (
              <motion.div
                key={block.id}
                layout
                initial={isSelected ? { scale: 0.5, opacity: 0 } : false}
                animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: isSelected ? animationDelay : 0 
                }}
                className={blockClass}
                title={`Block ${block.id}${
                  block.inodeId !== null ? ` (Inode ${block.inodeId})` : ' (Free)'
                }${
                  block.fatNextBlock !== undefined
                    ? ` → FAT: ${block.fatNextBlock === -1 ? 'EOF' : block.fatNextBlock}`
                    : ''
                }`}
              >
                {content}
                <span className="sr-only">Block {block.id}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Usage Bar */}
        <div className="mt-4 space-y-2">
          <div className="h-2 bg-block-free rounded overflow-hidden">
            <div
              className="h-full bg-block-used transition-all duration-300"
              style={{ width: `${(diskStats.usedBlocks / diskStats.totalBlocks) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{diskStats.usedSizeKB} KB used</span>
            <span>{diskStats.freeSizeKB} KB free of {diskStats.totalSizeKB} KB</span>
          </div>
        </div>

        {/* Concept Note */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disk Block Allocation:</strong> Files are stored in fixed-size blocks.
            A 10KB file needs 3 blocks (4KB each = 12KB allocated). The bitmap tracks
            which blocks are free (0) or used (1) for O(1) allocation lookups.
          </p>
        </div>
      </div>
    </div>
  );
}
