"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/design/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/components/ui/form";
import { Input } from "@repo/design/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/components/ui/select";
import { ArrowLeftIcon } from "lucide-react";
import {
  EditBase as RaEdit,
  useEditController,
  useNotify,
  useRedirect,
  useUpdate,
} from "ra-core";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  role: z.enum(["admin", "user"]).optional().nullable(),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserEditInner = () => {
  const { record, isLoading } = useEditController();
  const [update] = useUpdate();
  const notify = useNotify();
  const redirect = useRedirect();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: record?.name || "",
      email: record?.email || "",
      password: "",
      role: (record?.role as "admin" | "user" | null) || null,
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (!record?.id) return;

    update(
      "users",
      {
        id: record.id,
        data: {
          name: data.name,
          email: data.email,
          role: data.role,
          ...(data.password ? { password: data.password } : {}),
        },
        previousData: record,
      },
      {
        onSuccess: () => {
          notify("User updated successfully", { type: "success" });
          redirect("list", "users");
        },
        onError: () => {
          notify("Failed to update user", { type: "error" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading user…</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => redirect("list", "users")}
            size="icon"
            variant="ghost"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div>
            <CardTitle>Edit User</CardTitle>
            <CardDescription>Update user information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (leave blank to keep current)</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value || null)}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Button
                onClick={() => redirect("list", "users")}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export const UserEdit = () => (
  <div className="container mx-auto px-4 py-8">
    <RaEdit>
      <UserEditInner />
    </RaEdit>
  </div>
);
