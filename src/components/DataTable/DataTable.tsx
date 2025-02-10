
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <Card className={className}>
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            {/* Header content will be injected here */}
          </TableHeader>
          <TableBody>
            {children}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
