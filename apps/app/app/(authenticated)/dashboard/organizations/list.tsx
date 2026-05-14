"use client";

import { Alert, AlertDescription } from "@repo/design/components/ui/alert";
import { Button } from "@repo/design/components/ui/button";
import { Card, CardContent, CardHeader } from "@repo/design/components/ui/card";
import { Input } from "@repo/design/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design/components/ui/table";
import { AlertCircleIcon, SearchIcon } from "lucide-react";
import { useRedirect } from "ra-core";
import * as React from "react";
import { useOrganizations } from "../hooks";
import {
  formatDate,
  PageHeader,
  PageShell,
  TableEmptyRow,
  TableSkeletonRows,
} from "../page-shell";
import { CreateOrganizationDialog } from "./create-dialog";

const COL_COUNT = 5;

// Mirrors: name, slug (code), member count, date, sm button.
const SKELETON_CELLS = [
  { className: "h-4 w-32" }, // name
  { className: "h-4 w-24" }, // slug (code)
  { className: "h-4 w-8" }, // member count (tabular-nums)
  { className: "h-4 w-24" }, // date
  { className: "h-8 w-14 rounded-md" }, // sm button
];

export const OrganizationList = () => {
  const redirect = useRedirect();
  const { data, isLoading, error } = useOrganizations();
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!data) return [];
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (o) =>
        o.name.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <PageShell>
      <PageHeader
        actions={<CreateOrganizationDialog />}
        description="Manage workspaces across the platform."
        title="Organizations"
      />

      {error ? (
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <div className="relative">
              <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or slug..."
                value={search}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeletonRows cells={SKELETON_CELLS} />
                ) : filtered.length === 0 ? (
                  <TableEmptyRow
                    colSpan={COL_COUNT}
                    description={
                      search
                        ? "Try a different search."
                        : "Create one to get started."
                    }
                    title="No organizations"
                  />
                ) : (
                  filtered.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.name}</TableCell>
                      <TableCell>
                        <code className="text-muted-foreground text-xs">
                          {o.slug}
                        </code>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {o.memberCount}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(o.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            redirect("edit", "organizations", o.id)
                          }
                          size="sm"
                          variant="ghost"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
};
