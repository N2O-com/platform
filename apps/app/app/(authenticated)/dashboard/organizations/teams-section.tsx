"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Badge } from "@repo/design/components/ui/badge";
import { Button, buttonVariants } from "@repo/design/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
} from "@repo/design/components/ui/empty";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import { Input } from "@repo/design/components/ui/input";
import { toast } from "@repo/design/components/ui/sonner";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTeam, useDeleteTeam, useUpdateTeam } from "../hooks";

type Team = {
  id: string;
  name: string;
  createdAt: string;
};

const nameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});
type NameValues = z.infer<typeof nameSchema>;

const CreateTeamDialog = ({ organizationId }: { organizationId: string }) => {
  const [open, setOpen] = React.useState(false);
  const create = useCreateTeam(organizationId);
  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async ({ name }: NameValues) => {
    try {
      await create.mutateAsync(name);
      toast.success("Team created");
      form.reset();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          New team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Teams group members within an organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            id="create-team-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Engineering" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={create.isPending}
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={create.isPending}
            form="create-team-form"
            type="submit"
          >
            {create.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TeamRow = ({
  team,
  organizationId,
}: {
  team: Team;
  organizationId: string;
}) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(team.name);
  const update = useUpdateTeam(organizationId);
  const remove = useDeleteTeam(organizationId);

  React.useEffect(() => {
    if (!editing) setDraft(team.name);
  }, [editing, team.name]);

  const save = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === team.name) {
      setEditing(false);
      return;
    }
    try {
      await update.mutateAsync({ teamId: team.id, name: trimmed });
      toast.success("Team renamed");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <li className="flex items-center justify-between gap-3 rounded-md border p-3">
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              className="h-8"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(false);
              }}
              value={draft}
            />
            <Button
              className="size-8"
              disabled={update.isPending}
              onClick={save}
              size="icon"
              variant="ghost"
            >
              <CheckIcon className="size-4" />
            </Button>
            <Button
              className="size-8"
              onClick={() => setEditing(false)}
              size="icon"
              variant="ghost"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="truncate font-medium text-sm">{team.name}</p>
            <p
              className="text-muted-foreground text-xs"
              suppressHydrationWarning
            >
              Created {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
      {!editing && (
        <div className="flex items-center gap-1">
          <Button onClick={() => setEditing(true)} size="icon" variant="ghost">
            <PencilIcon className="size-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Trash2Icon className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {team.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  The team and its memberships will be removed. Members keep
                  their organization access.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await remove.mutateAsync(team.id);
                      toast.success("Team deleted");
                    } catch (err) {
                      toast.error(
                        err instanceof Error ? err.message : "Failed"
                      );
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </li>
  );
};

export const TeamsSection = ({
  organizationId,
  teams,
}: {
  organizationId: string;
  teams: Team[];
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Teams</CardTitle>
          <Badge variant="secondary">{teams.length}</Badge>
        </div>
        <CreateTeamDialog organizationId={organizationId} />
      </div>
    </CardHeader>
    <CardContent>
      {teams.length === 0 ? (
        <Empty>
          <EmptyTitle>No teams yet</EmptyTitle>
          <EmptyDescription>
            Create a team to group members within this organization.
          </EmptyDescription>
        </Empty>
      ) : (
        <ul className="space-y-2">
          {teams.map((t) => (
            <TeamRow key={t.id} organizationId={organizationId} team={t} />
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);
