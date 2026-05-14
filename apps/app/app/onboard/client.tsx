"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { organization } from "@repo/auth/client";
import { Alert, AlertDescription } from "@repo/design/components/ui/alert";
import { Button } from "@repo/design/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import { Input } from "@repo/design/components/ui/input";
import { AlertCircle } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Invitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  organizationName?: string | null;
  organizationSlug?: string | null;
};

const createOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9-]+$/i, "Letters, numbers, and dashes only."),
});

type CreateOrgValues = z.infer<typeof createOrgSchema>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const OnboardClient = ({
  invitations,
}: {
  invitations: Invitation[];
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const form = useForm<CreateOrgValues>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { name: "", slug: "" },
  });

  const acceptInvite = async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      const result = await organization.acceptInvitation({ invitationId: id });
      if (result?.error) {
        throw new Error(result.error.message ?? "Failed to accept invitation");
      }
      const orgId = result?.data?.invitation?.organizationId;
      if (orgId) {
        await organization.setActive({ organizationId: orgId });
      }
      window.location.href = "/";
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to accept invitation"
      );
    } finally {
      setBusy(false);
    }
  };

  const createOrganization = async (values: CreateOrgValues) => {
    setBusy(true);
    setError(null);
    try {
      const result = await organization.create({
        name: values.name,
        slug: values.slug,
      });
      if (result?.error) {
        throw new Error(
          result.error.message ?? "Failed to create organization"
        );
      }
      const orgId = result?.data?.id;
      if (orgId) {
        await organization.setActive({ organizationId: orgId });
      }
      window.location.href = "/";
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create organization"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">Welcome</h1>
        <p className="text-muted-foreground text-sm">
          Join an existing workspace or create your own.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {invitations.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-medium text-muted-foreground text-sm">
            Pending invitations
          </h2>
          <ul className="space-y-2">
            {invitations.map((inv) => (
              <li
                className="flex items-center justify-between rounded-md border p-3"
                key={inv.id}
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-sm">
                    {inv.organizationName ?? "Workspace"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Invited as {inv.role}
                  </p>
                </div>
                <Button
                  disabled={busy}
                  onClick={() => acceptInvite(inv.id)}
                  size="sm"
                >
                  Accept
                </Button>
              </li>
            ))}
          </ul>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-medium text-muted-foreground text-sm">
          Create a workspace
        </h2>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(createOrganization)}
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
                          form.setValue("slug", slugify(e.target.value));
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
            <Button className="w-full" disabled={busy} type="submit">
              {busy ? "Creating..." : "Create workspace"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
