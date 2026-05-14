"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/design/components/ui/alert-dialog";
import { Button, buttonVariants } from "@repo/design/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { toast } from "@repo/design/components/ui/sonner";
import { MoreHorizontalIcon } from "lucide-react";
import { useDelete, useRedirect, useRefresh } from "ra-core";
import * as React from "react";
import { useBanUser, useRevokeUserSessions, useUnbanUser } from "../hooks";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    banned?: boolean | null;
  };
};

type Confirm = null | {
  title: string;
  description: string;
  action: () => Promise<unknown>;
  destructive?: boolean;
};

export const UserRowActions = ({ user }: Props) => {
  const redirect = useRedirect();
  const refresh = useRefresh();
  const [deleteOne] = useDelete();
  const ban = useBanUser();
  const unban = useUnbanUser();
  const revoke = useRevokeUserSessions();
  const [confirm, setConfirm] = React.useState<Confirm>(null);
  const [pending, setPending] = React.useState(false);

  const run = async () => {
    if (!confirm) return;
    setPending(true);
    try {
      await confirm.action();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setPending(false);
      setConfirm(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => redirect("edit", "users", user.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setConfirm({
                title: "Revoke all sessions?",
                description: `Sign ${user.name} out of every device. They'll need to log in again.`,
                action: async () => {
                  await revoke.mutateAsync(user.id);
                  toast.success("Sessions revoked");
                },
              })
            }
          >
            Revoke sessions
          </DropdownMenuItem>
          {user.banned ? (
            <DropdownMenuItem
              onClick={() =>
                setConfirm({
                  title: "Unban user?",
                  description: `${user.name} will be able to sign in again.`,
                  action: async () => {
                    await unban.mutateAsync(user.id);
                    toast.success("User unbanned");
                    refresh();
                  },
                })
              }
            >
              Unban
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() =>
                setConfirm({
                  title: "Ban user?",
                  description: `${user.name} will be prevented from signing in.`,
                  action: async () => {
                    await ban.mutateAsync({ userId: user.id });
                    toast.success("User banned");
                    refresh();
                  },
                })
              }
            >
              Ban
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              setConfirm({
                title: "Delete user?",
                description: `${user.name} and all their data will be permanently removed. This can't be undone.`,
                destructive: true,
                action: () =>
                  new Promise<void>((resolve, reject) => {
                    deleteOne(
                      "users",
                      { id: user.id, previousData: user },
                      {
                        onSuccess: () => {
                          toast.success("User deleted");
                          resolve();
                        },
                        onError: (err) => {
                          reject(err);
                        },
                      }
                    );
                  }),
              })
            }
            variant="destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        onOpenChange={(o) => !o && setConfirm(null)}
        open={!!confirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirm?.destructive
                  ? buttonVariants({ variant: "destructive" })
                  : undefined
              }
              disabled={pending}
              onClick={(e) => {
                e.preventDefault();
                run();
              }}
            >
              {pending ? "Working..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
