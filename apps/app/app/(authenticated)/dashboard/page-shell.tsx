"use client";

import {
  Empty,
  EmptyDescription,
  EmptyTitle,
} from "@repo/design/components/ui/empty";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import { TableCell, TableRow } from "@repo/design/components/ui/table";
import { cn } from "@repo/design/lib/utils";
import type { ReactNode } from "react";

export const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="container mx-auto space-y-6 px-4 py-8">{children}</div>
);

export const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="space-y-1">
      <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
    {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
  </div>
);

export const TableEmptyRow = ({
  colSpan,
  title,
  description,
}: {
  colSpan: number;
  title: string;
  description?: string;
}) => (
  <TableRow>
    <TableCell className="py-12" colSpan={colSpan}>
      <Empty>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </Empty>
    </TableCell>
  </TableRow>
);

/**
 * Each cell describes the placeholder size/shape that mirrors a real row,
 * preventing layout shift when data loads. Sizes use tailwind classes so
 * they stay in sync with the populated UI (e.g. `size-9` matches Button
 * `size="icon"`, `h-5 w-16 rounded-md` matches a Badge).
 */
export type SkeletonCell = {
  className?: string;
  align?: "left" | "right" | "center";
};

const DEFAULT_CELL: SkeletonCell = { className: "h-4 w-32" };

export const TableSkeletonRows = ({
  rows = 5,
  cells,
}: {
  rows?: number;
  cells: SkeletonCell[];
}) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        {cells.map((c, j) => (
          <TableCell key={j}>
            <div
              className={cn(
                "flex",
                c.align === "right" && "justify-end",
                c.align === "center" && "justify-center"
              )}
            >
              <Skeleton className={c.className ?? DEFAULT_CELL.className} />
            </div>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
