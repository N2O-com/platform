"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/design/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import { Input } from "@repo/design/components/ui/input";
import { toast } from "@repo/design/components/ui/sonner";
import { PlusIcon } from "lucide-react";
import { useRedirect } from "ra-core";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateOrganization } from "../hooks";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .max(100)
    .regex(/^[a-z0-9-]+$/i, "Letters, numbers, and dashes only."),
});
type Values = z.infer<typeof schema>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const CreateOrganizationDialog = () => {
  const [open, setOpen] = React.useState(false);
  const redirect = useRedirect();
  const create = useCreateOrganization();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "" },
  });

  const onSubmit = async (values: Values) => {
    let org: Awaited<ReturnType<typeof create.mutateAsync>>;
    try {
      org = await create.mutateAsync(values);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
      return;
    }
    toast.success("Organization created");
    form.reset();
    setOpen(false);
    redirect("edit", "organizations", org.id);
  };

  return (
    <Dialog
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) form.reset();
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          New organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Workspaces own members, teams, and resources.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            id="create-org-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!form.formState.dirtyFields.slug) {
                          form.setValue("slug", slugify(e.target.value), {
                            shouldValidate: true,
                          });
                        }
                      }}
                      placeholder="Acme Inc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="acme" />
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
            form="create-org-form"
            type="submit"
          >
            {create.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
