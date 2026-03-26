/**
 * ErrorToast Component
 * 
 * Displays error messages from file system operations.
 */

import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-foreground text-background p-4 rounded shadow-lg flex items-start gap-3 z-50">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">Error</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-background hover:bg-background/20"
        onClick={onDismiss}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
