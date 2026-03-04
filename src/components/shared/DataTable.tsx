import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../ui/table';
import { cn } from '../../lib/utils';
import { Loader2Icon } from 'lucide-react';
export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: ReactNode;
  className?: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}
export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyState,
  className,
  rowKey,
  onRowClick
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        className
      )}>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col) =>
            <TableHead
              key={col.key}
              className={cn('font-semibold text-foreground', col.className)}>

                {col.header}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ?
          <TableRow>
              <TableCell colSpan={columns.length} className="py-16 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              </TableCell>
            </TableRow> :
          data.length === 0 ?
          <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState}
              </TableCell>
            </TableRow> :

          data.map((row) =>
          <TableRow
            key={rowKey(row)}
            onClick={() => onRowClick?.(row)}
            className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}>

                {columns.map((col) =>
            <TableCell key={col.key} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
            )}
              </TableRow>
          )
          }
        </TableBody>
      </Table>
    </div>);

}