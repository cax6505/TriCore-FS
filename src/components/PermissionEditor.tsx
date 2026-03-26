import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PermissionSet } from '@/types/filesystem';

interface PermissionEditorProps {
    permissions: PermissionSet;
    onChange: (permissions: PermissionSet) => void;
    readOnly?: boolean;
}

export function PermissionEditor({ permissions, onChange, readOnly }: PermissionEditorProps) {
    const handleChange = (key: keyof PermissionSet, checked: boolean) => {
        onChange({ ...permissions, [key]: checked });
    };

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Permissions
            </h4>
            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <Checkbox 
                    id="perm-read" 
                    checked={permissions.read} 
                    onCheckedChange={(c) => handleChange('read', c as boolean)}
                    disabled={readOnly}
                    className="w-3 h-3"
                    />
                    <Label htmlFor="perm-read" className="text-xs font-normal cursor-pointer">Read</Label>
                </div>
                <div className="flex items-center gap-1.5">
                    <Checkbox 
                    id="perm-write" 
                    checked={permissions.write} 
                    onCheckedChange={(c) => handleChange('write', c as boolean)}
                    disabled={readOnly}
                    className="w-3 h-3"
                    />
                    <Label htmlFor="perm-write" className="text-xs font-normal cursor-pointer">Write</Label>
                </div>
                <div className="flex items-center gap-1.5">
                    <Checkbox 
                    id="perm-execute" 
                    checked={permissions.execute} 
                    onCheckedChange={(c) => handleChange('execute', c as boolean)}
                    disabled={readOnly}
                    className="w-3 h-3"
                    />
                    <Label htmlFor="perm-execute" className="text-xs font-normal cursor-pointer">Execute</Label>
                </div>
            </div>
        </div>
    );
}
