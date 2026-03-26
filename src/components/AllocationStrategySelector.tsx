import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AllocationStrategy } from '@/types/filesystem';
import { AlertCircle, FileDigit, Grid3X3, Layers, Link, Table2 } from 'lucide-react';

interface AllocationStrategySelectorProps {
  currentStrategy: AllocationStrategy;
  onStrategyChange: (strategy: AllocationStrategy) => void;
  fragmentation: number;
}

export function AllocationStrategySelector({
  currentStrategy,
  onStrategyChange,
  fragmentation,
}: AllocationStrategySelectorProps) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="py-3 px-4 pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Allocation Strategy</span>
          {/* {currentStrategy === 'contiguous' && (
            <Badge variant={fragmentation > 30 ? "destructive" : "secondary"} className="text-xs">
              frag: {fragmentation}%
            </Badge>
          )} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-4 py-2 overflow-y-auto">
        <RadioGroup
          value={currentStrategy}
          onValueChange={(val) => onStrategyChange(val as AllocationStrategy)}
          className="grid gap-3"
        >
          <div 
            onClick={() => onStrategyChange('contiguous')}
            className={`
            flex items-start space-x-3 rounded-md border p-2 transition-all cursor-pointer hover:bg-muted/50
            ${currentStrategy === 'contiguous' ? 'border-primary bg-primary/5' : 'border-transparent'}
          `}>
             <RadioGroupItem value="contiguous" id="contiguous" className="mt-1" />
             <div className="grid gap-1.5 flex-1">
               <Label htmlFor="contiguous" className="font-medium cursor-pointer flex items-center gap-2">
                 <Grid3X3 className="w-3.5 h-3.5" />
                 Contiguous
               </Label>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Files stored in adjacent blocks. Simple and fast sequential access.
                 <span className="block mt-1 text-xs text-destructive/80 font-medium">
                   Major Issue: External Fragmentation
                 </span>
               </p>
             </div>
          </div>

          <div 
            onClick={() => onStrategyChange('linked')}
            className={`
            flex items-start space-x-3 rounded-md border p-2 transition-all cursor-pointer hover:bg-muted/50
            ${currentStrategy === 'linked' ? 'border-primary bg-primary/5' : 'border-transparent'}
          `}>
             <RadioGroupItem value="linked" id="linked" className="mt-1" />
             <div className="grid gap-1.5 flex-1">
               <Label htmlFor="linked" className="font-medium cursor-pointer flex items-center gap-2">
                 <Link className="w-3.5 h-3.5" />
                 Linked
               </Label>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Blocks scattered anywhere, linked by pointers. No external fragmentation.
                 <span className="block mt-1 text-xs text-amber-600/80 font-medium">
                   Issue: Slow random access
                 </span>
               </p>
             </div>
          </div>

          <div 
            onClick={() => onStrategyChange('indexed')}
            className={`
            flex items-start space-x-3 rounded-md border p-2 transition-all cursor-pointer hover:bg-muted/50
            ${currentStrategy === 'indexed' ? 'border-primary bg-primary/5' : 'border-transparent'}
          `}>
             <RadioGroupItem value="indexed" id="indexed" className="mt-1" />
             <div className="grid gap-1.5 flex-1">
               <Label htmlFor="indexed" className="font-medium cursor-pointer flex items-center gap-2">
                 <FileDigit className="w-3.5 h-3.5" />
                 Indexed
               </Label>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Index block stores pointers to all data blocks. Efficient direct access.
                 <span className="block mt-1 text-xs text-blue-600/80 font-medium">
                   Issue: Index block overhead
                 </span>
               </p>
             </div>
          </div>

          <div 
            onClick={() => onStrategyChange('unix')}
            className={`
            flex items-start space-x-3 rounded-md border p-2 transition-all cursor-pointer hover:bg-muted/50
            ${currentStrategy === 'unix' ? 'border-primary bg-primary/5' : 'border-transparent'}
          `}>
             <RadioGroupItem value="unix" id="unix" className="mt-1" />
             <div className="grid gap-1.5 flex-1">
               <Label htmlFor="unix" className="font-medium cursor-pointer flex items-center gap-2">
                 <Layers className="w-3.5 h-3.5" />
                 Unix Inode (Multi-level)
               </Label>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Hybrid: Direct pointers for small files, Indirect for large files.
                 <span className="block mt-1 text-xs text-purple-600/80 font-medium">
                   Scalable & Standard
                 </span>
               </p>
             </div>
          </div>

          <div 
            onClick={() => onStrategyChange('fat')}
            className={`
            flex items-start space-x-3 rounded-md border p-2 transition-all cursor-pointer hover:bg-muted/50
            ${currentStrategy === 'fat' ? 'border-primary bg-primary/5' : 'border-transparent'}
          `}>
             <RadioGroupItem value="fat" id="fat" className="mt-1" />
             <div className="grid gap-1.5 flex-1">
               <Label htmlFor="fat" className="font-medium cursor-pointer flex items-center gap-2">
                 <Table2 className="w-3.5 h-3.5" />
                 FAT (File Allocation Table)
               </Label>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Chain stored in a global table; blocks hold only data. Each directory entry records the first cluster.
                 <span className="block mt-1 text-xs text-orange-600/80 font-medium">
                   Issue: FAT table can be a bottleneck
                 </span>
               </p>
             </div>
          </div>
        </RadioGroup>

        <Alert className="mt-3 py-2 bg-muted/30 text-xs">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription className="ml-2 text-xs text-muted-foreground">
            Switching only affects new files. Existing files remain unchanged.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
