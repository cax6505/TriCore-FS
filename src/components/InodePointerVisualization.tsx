import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Inode, MAX_DIRECT_POINTERS, POINTERS_PER_BLOCK } from '@/types/filesystem';
import { ArrowDown, Box, CornerDownRight, Layers, Table2 } from 'lucide-react';

interface InodePointerVisualizationProps {
  inode: Inode | null;
}

export function InodePointerVisualization({ inode }: InodePointerVisualizationProps) {
  if (!inode) return null;

  // ── FAT visualization ─────────────────────────────────────────────────────
  if (inode.allocationStrategy === 'fat') {
    const clusters = inode.blockPointers;
    return (
      <Card className="mt-4 border-dashed border-orange-300">
        <CardHeader className="py-2 px-3 bg-orange-50/60 dark:bg-orange-900/20">
          <CardTitle className="text-xs font-mono uppercase flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Table2 className="w-3 h-3" />
            FAT Cluster Chain
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs">
          <ScrollArea className="h-[200px] pr-2">
            {/* Header row */}
            <div className="grid grid-cols-3 gap-1 mb-2 font-semibold text-[10px] text-muted-foreground uppercase">
              <span>Pos</span>
              <span>Cluster</span>
              <span>FAT[n]</span>
            </div>
            {clusters.map((blockId, index) => {
              const next = index < clusters.length - 1 ? clusters[index + 1] : -1;
              return (
                <div
                  key={blockId}
                  className="grid grid-cols-3 gap-1 mb-1 items-center"
                >
                  <span className="text-muted-foreground font-mono">{index + 1}</span>
                  <span className="font-mono bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-1 rounded border border-orange-200 dark:border-orange-700">
                    {blockId}
                  </span>
                  <span className={`font-mono px-1 rounded border ${next === -1 ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-orange-50 border-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'}`}>
                    {next === -1 ? 'EOF' : next}
                  </span>
                </div>
              );
            })}
            <p className="mt-3 text-[10px] text-muted-foreground leading-relaxed">
              The directory entry stores only cluster <strong>{clusters[0] ?? '—'}</strong> (first).
              The OS walks the FAT table to find all remaining clusters.
            </p>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // ── Unix inode pointer visualization ──────────────────────────────────────
  // only show for unix strategy or if fields are present
  if (inode.allocationStrategy !== 'unix' && !inode.directPointers) return null;

  const directCount = inode.directPointers?.length || 0;
  const hasSingle = inode.singleIndirectPointer !== null && inode.singleIndirectPointer !== undefined;
  const hasDouble = inode.doubleIndirectPointer !== null && inode.doubleIndirectPointer !== undefined;
  
  // Estimate usage
  // In a real reader we would read the index block to know how many are used.
  // Here we can infer from total size or just show structure availability.
  
  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="py-2 px-3 bg-muted/20">
        <CardTitle className="text-xs font-mono uppercase flex items-center gap-2">
           <Layers className="w-3 h-3" />
           Inode Pointers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <ScrollArea className="h-[200px] pr-2">
            
            {/* Direct Pointers */}
            <div className="mb-4">
                <div className="font-semibold mb-1 flex items-center">
                    <Box className="w-3 h-3 mr-1 text-blue-500" />
                    Direct Pointers (12)
                </div>
                <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: MAX_DIRECT_POINTERS }).map((_, i) => (
                        <div 
                            key={`d-${i}`}
                            className={`h-4 border rounded flex items-center justify-center text-[8px]
                                ${i < directCount 
                                    ? 'bg-blue-100 border-blue-300 text-blue-700 font-bold' 
                                    : 'bg-muted/30 text-muted-foreground'
                                }`}
                        >
                            {i < directCount ? inode.directPointers![i] : ''}
                        </div>
                    ))}
                </div>
            </div>

            {/* Single Indirect */}
            <div className="mb-4">
                 <div className="font-semibold mb-1 flex items-center">
                    <CornerDownRight className="w-3 h-3 mr-1 text-amber-500" />
                    Single Indirect
                </div>
                <div className="pl-2 border-l-2 border-amber-200 ml-1">
                    <div className="flex items-center gap-2 mb-2">
                         <div className={`w-8 h-8 rounded border flex items-center justify-center font-mono
                             ${hasSingle 
                                 ? 'bg-amber-100 border-amber-400 text-amber-800' 
                                 : 'bg-muted/10 border-dashed'}
                         `}>
                             {hasSingle ? inode.singleIndirectPointer : 'Null'}
                         </div>
                         {hasSingle && <ArrowDown className="w-3 h-3 text-amber-400 -rotate-90" />}
                         {hasSingle && (
                             <div className="text-[10px] text-muted-foreground bg-amber-50 px-1 rounded border border-amber-100">
                                 Index Block<br/>
                                 Holds up to {POINTERS_PER_BLOCK} ptrs
                             </div>
                         )}
                    </div>
                    {hasSingle && (
                        <div className="bg-amber-50/50 p-1 rounded border border-amber-100/50">
                             <div className="grid grid-cols-8 gap-0.5">
                                 {/* Visual representation of data blocks pointed to */}
                                 {Array.from({ length: 16 }).map((_, i) => (
                                      <div key={i} className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Double Indirect */}
            <div>
                 <div className="font-semibold mb-1 flex items-center">
                    <CornerDownRight className="w-3 h-3 mr-1 text-purple-500" />
                    Double Indirect
                </div>
                <div className="pl-2 border-l-2 border-purple-200 ml-1">
                     <div className="flex items-center gap-2 mb-2">
                         <div className={`w-8 h-8 rounded border flex items-center justify-center font-mono
                             ${hasDouble 
                                 ? 'bg-purple-100 border-purple-400 text-purple-800' 
                                 : 'bg-muted/10 border-dashed'}
                         `}>
                             {hasDouble ? inode.doubleIndirectPointer : 'Null'}
                         </div>
                         {hasDouble && <ArrowDown className="w-3 h-3 text-purple-400 -rotate-90" />}
                         {hasDouble && (
                             <div className="text-[10px] text-muted-foreground bg-purple-50 px-1 rounded border border-purple-100">
                                 Level 1 Index<br/>
                                 Points to Index Blocks
                             </div>
                         )}
                    </div>
                </div>
            </div>

        </ScrollArea>
      </CardContent>
    </Card>
  );
}
