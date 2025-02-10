
import { TableRow } from "@/components/ui/table";

interface DataTableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableRow({ children, className }: DataTableRowProps) {
  return <TableRow className={className}>{children}</TableRow>;
}
