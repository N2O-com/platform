"use client";

import { Alert, AlertDescription } from "@repo/design/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/design/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/components/ui/avatar";
import { Badge } from "@repo/design/components/ui/badge";
import { Button, buttonVariants } from "@repo/design/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/components/ui/select";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import { toast } from "@repo/design/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design/components/ui/table";
import { AlertCircleIcon, ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { useRedirect } from "ra-core";
import { useParams } from "react-router-dom";
import {
  useCancelInvitation,
  useDeleteOrganization,
  useOrganization,
  useRemoveMember,
  useUpdateMemberRole,
} from "../hooks";
import { formatDate, PageShell, TableEmptyRow } from "../page-shell";
import { TeamsSection } from "./teams-section";

const initials = (name: string) =>
  name
    .split(" ")
    .flatMap((p) => (p[0] ? [p[0]] : []))
    .slice(0, 2)
    .join("")
    .toUpperCase();

const ROLE_OPTIONS = ["owner", "admin", "member"] as const;

const HeaderSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Skeleton className="size-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </CardHeader>
  </Card>
);

// Mirrors the real members table row exactly: avatar + stacked name/email,
// Select trigger, date text, icon button — same widths/heights so the layout
// doesn't shift on load.
const MemberRowsSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-9 w-32 rounded-md" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="size-9 rounded-md" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const Inner = ({ id }: { id: string }) => {
  const redirect = useRedirect();
  const { data, isLoading, error } = useOrganization(id);
  const deleteOrg = useDeleteOrganization();
  const removeMember = useRemoveMember(id);
  const updateRole = useUpdateMemberRole(id);
  const cancelInvite = useCancelInvitation(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-5 w-6 rounded-md" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <MemberRowsSkeleton />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="size-4" />
        <AlertDescription>
          {(error as Error)?.message ?? "Organization not found"}
        </AlertDescription>
      </Alert>
    );
  }

  const { organization, members, invitations, teams } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Button
                onClick={() => redirect("list", "organizations")}
                size="icon"
                variant="ghost"
              >
                <ArrowLeftIcon className="size-4" />
              </Button>
              <div className="min-w-0">
                <CardTitle className="truncate">{organization.name}</CardTitle>
                <CardDescription>
                  <code className="text-xs">{organization.slug}</code>
                  <span className="mx-1.5">·</span>
                  Created {formatDate(organization.createdAt)}
                </CardDescription>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash2Icon className="size-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {organization.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    All members, invitations, and teams will be removed. This
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await deleteOrg.mutateAsync(organization.id);
                      } catch (err) {
                        toast.error(
                          err instanceof Error ? err.message : "Delete failed"
                        );
                        return;
                      }
                      toast.success("Organization deleted");
                      redirect("list", "organizations");
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Members</CardTitle>
            <Badge variant="secondary">{members.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableEmptyRow
                  colSpan={4}
                  description="Invitations sent from the workspace will appear here once accepted."
                  title="No members yet"
                />
              ) : (
                members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          {m.userImage && <AvatarImage src={m.userImage} />}
                          <AvatarFallback>
                            {initials(m.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">
                            {m.userName}
                          </p>
                          <p className="truncate text-muted-foreground text-xs">
                            {m.userEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={async (role) => {
                          try {
                            await updateRole.mutateAsync({
                              memberId: m.id,
                              role: role as "owner" | "admin" | "member",
                            });
                            toast.success("Role updated");
                          } catch (err) {
                            toast.error(
                              err instanceof Error ? err.message : "Failed"
                            );
                          }
                        }}
                        value={m.role}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(m.createdAt)}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2Icon className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {m.userName} will lose access to{" "}
                              {organization.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className={buttonVariants({
                                variant: "destructive",
                              })}
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  await removeMember.mutateAsync(m.id);
                                  toast.success("Member removed");
                                } catch (err) {
                                  toast.error(
                                    err instanceof Error
                                      ? err.message
                                      : "Failed"
                                  );
                                }
                              }}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Pending invitations</CardTitle>
              <Badge variant="secondary">{invitations.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{inv.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(inv.expiresAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={async () => {
                          try {
                            await cancelInvite.mutateAsync(inv.id);
                            toast.success("Invitation canceled");
                          } catch (err) {
                            toast.error(
                              err instanceof Error ? err.message : "Failed"
                            );
                          }
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <TeamsSection organizationId={organization.id} teams={teams} />
    </div>
  );
};

export const OrganizationEdit = () => {
  const { id } = useParams<{ id: string }>();
  return <PageShell>{id ? <Inner id={id} /> : null}</PageShell>;
};
