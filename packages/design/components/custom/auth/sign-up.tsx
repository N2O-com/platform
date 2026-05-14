"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@repo/auth/client";
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
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (values: SignUpFormValues) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          callbackURL: returnTo ?? "/verify-email",
        },
        {
          onSuccess: () => {
            setSuccess(true);
          },
        }
      );
    } catch (err: any) {
      console.error("Sign up error:", err);
      const errorMessage =
        err?.body?.message ||
        err?.message ||
        "Unable to sign up. Please check your details and try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your information to get started
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-success/20 bg-success/5">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Account created! Check your email to verify your address.
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" type="text" {...field} />
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
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                  />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={submitting} type="submit">
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          className="font-medium hover:underline"
          href={
            returnTo
              ? `/sign-in?returnTo=${encodeURIComponent(returnTo)}`
              : "/sign-in"
          }
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
