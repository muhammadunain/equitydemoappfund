import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ message = 'An error occurred' }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 p-4 text-destructive bg-destructive/10 rounded-lg">
      <AlertTriangle size={20} />
      <p>{message}</p>
    </div>
  );
} 