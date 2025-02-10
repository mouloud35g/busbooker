
import { TableCell } from "@/components/ui/table";

interface DataTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableCell({ children, className }: DataTableCellProps) {
  return <TableCell className={className}>{children}</TableCell>;
}
