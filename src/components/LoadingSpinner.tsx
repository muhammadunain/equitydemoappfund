import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
} 