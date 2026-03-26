import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSystemState, ROOT_INODE_ID } from '@/types/filesystem';
import { ChevronRight, File, Folder, Home, Link2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PathVisualizerProps {
  state: FileSystemState | null;
  path: string | null;
}

interface Step {
  name: string;
  inodeId: number;
  type: 'directory' | 'file' | 'symlink';
  status: 'pending' | 'resolved' | 'target';
}

export function PathVisualizer({ state, path }: PathVisualizerProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  
  useEffect(() => {
    if (!state || !path) {
      setSteps([]);
      return;
    }
    
    const parts = path.split('/').filter(p => p.length > 0);
    const newSteps: Step[] = [];
    
    // Start at Root
    let currentInodeId = ROOT_INODE_ID;
    const rootInode = state.inodes.get(ROOT_INODE_ID);
    
    if (rootInode) {
        newSteps.push({
            name: '/',
            inodeId: ROOT_INODE_ID,
            type: 'directory',
            status: parts.length === 0 ? 'target' : 'resolved'
        });
    }

    // Traverse
    let success = true;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const dir = state.directories.get(currentInodeId);
        
        if (!dir) {
            success = false;
            break;
        }
        
        const entry = dir.entries.find(e => e.name === part);
        if (!entry) {
            success = false;
            break;
        }
        
        const inode = state.inodes.get(entry.inodeId);
        if (!inode) {
             success = false;
             break;
        }
        
        const isTarget = i === parts.length - 1;
        newSteps.push({
            name: part,
            inodeId: entry.inodeId,
            type: inode.type,
            status: isTarget ? 'target' : 'resolved'
        });
        
        currentInodeId = entry.inodeId;
    }
    
    setSteps(newSteps);
    
  }, [state, path]);

  if (!state || !path || steps.length === 0) return null;

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="py-2 px-3 bg-muted/20">
        <CardTitle className="text-xs font-mono uppercase flex items-center gap-2">
           <Search className="w-3 h-3" />
           Path Resolution (Top-Down)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs">
         <div className="max-h-[150px] overflow-y-auto pr-2">
           <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground mb-2">
                  Resolving: <span className="font-mono text-foreground">{path}</span>
              </div>
              {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                      <div className={`p-1 rounded border ${step.status === 'target' ? 'bg-primary/10 border-primary' : 'bg-background'}`}>
                          {step.name === '/' ? <Home className="w-3 h-3" /> : 
                           step.type === 'directory' ? <Folder className="w-3 h-3" /> : 
                           step.type === 'symlink' ? <Link2 className="w-3 h-3" /> :
                           <File className="w-3 h-3" />
                          }
                      </div>
                      <div className="flex-1">
                          <p className="font-mono font-semibold">{step.name}</p>
                          <p className="text-[10px] text-muted-foreground">Inode {step.inodeId}</p>
                      </div>
                      {index < steps.length - 1 && (
                          <div className="text-muted-foreground">
                              <ChevronRight className="w-3 h-3" />
                          </div>
                      )}
                  </div>
              ))}
           </div>
         </div>
      </CardContent>
    </Card>
  );
}
