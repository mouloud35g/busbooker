
import { TableHead } from "@/components/ui/table";

interface DataTableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableHead({ children, className }: DataTableHeadProps) {
  return <TableHead className={className}>{children}</TableHead>;
}
