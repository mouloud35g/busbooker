
import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <InboxIcon className="h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  );
}
