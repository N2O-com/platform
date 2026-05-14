"use client";

import { Badge } from "@repo/design/components/ui/badge";
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
import { PlusIcon, SearchIcon } from "lucide-react";
import { ListBase as RaList, useListContext, useRedirect } from "ra-core";
import { useState } from "react";
import {
  formatDate,
  PageHeader,
  PageShell,
  TableEmptyRow,
  TableSkeletonRows,
} from "../page-shell";
import { UserRowActions } from "./row-actions";

const COL_COUNT = 6;

// Each entry mirrors the matching populated cell — name (text), email (text),
// role (Badge), status (Badge), date (text), actions (icon button).
const SKELETON_CELLS = [
  { className: "h-4 w-32" }, // name
  { className: "h-4 w-48" }, // email
  { className: "h-5 w-12 rounded-md" }, // role badge
  { className: "h-5 w-20 rounded-md" }, // status badge
  { className: "h-4 w-24" }, // created date
  { className: "size-9 rounded-md" }, // icon-button actions
];

const UserListInner = () => {
  const { data, isPending } = useListContext();
  const [searchValue, setSearchValue] = useState("");

  const filteredData = searchValue
    ? data?.filter(
        (user: { email?: string; name?: string }) =>
          user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : data;

  return (
    <Card>
      <CardHeader>
        <div className="relative">
          <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name or email..."
            value={searchValue}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableSkeletonRows cells={SKELETON_CELLS} />
            ) : !filteredData || filteredData.length === 0 ? (
              <TableEmptyRow
                colSpan={COL_COUNT}
                description={
                  searchValue ? "Try a different search." : undefined
                }
                title="No users found"
              />
            ) : (
              filteredData.map(
                (user: {
                  id: string;
                  name: string;
                  email: string;
                  role: string | null;
                  emailVerified: boolean;
                  banned?: boolean | null;
                  createdAt: string;
                }) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role ? (
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : user.emailVerified ? (
                        <Badge variant="default">Verified</Badge>
                      ) : (
                        <Badge variant="outline">Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <UserRowActions user={user} />
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const UserList = () => {
  const redirect = useRedirect();
  return (
    <PageShell>
      <PageHeader
        actions={
          <Button onClick={() => redirect("create", "users")}>
            <PlusIcon className="size-4" />
            New user
          </Button>
        }
        description="Manage everyone with access to the platform."
        title="Users"
      />
      <RaList>
        <UserListInner />
      </RaList>
    </PageShell>
  );
};
