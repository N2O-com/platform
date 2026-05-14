"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { sendVerificationEmail, signIn } from "@repo/auth/client";
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
import { AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = React.useState(false);
  const [verificationEmail, setVerificationEmail] = React.useState("");
  const [resendingVerification, setResendingVerification] =
    React.useState(false);
  const [verificationSent, setVerificationSent] = React.useState(false);

  const handleResendVerification = async () => {
    setResendingVerification(true);
    setError(null);

    try {
      await sendVerificationEmail({
        email: verificationEmail,
        callbackURL: "/verify-email",
      });
      setVerificationSent(true);
    } catch (err: any) {
      console.error("Resend verification error:", err);
      setError("Failed to send verification email. Please try again.");
    } finally {
      setResendingVerification(false);
    }
  };

  const onSubmit = async (values: SignInFormValues) => {
    setSubmitting(true);
    setError(null);
    setNeedsVerification(false);
    setVerificationSent(false);

    try {
      await signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: returnTo,
        },
        {
          onSuccess: () => {
            window.location.href = returnTo;
          },
          onError: (ctx: any) => {
            console.error("Sign in error:", ctx.error);

            // Check if ctx.error exists and has status
            if (ctx.error?.status === 403) {
              // Email not verified - trigger verification flow
              setVerificationEmail(values.email);
              setNeedsVerification(true);
              setError("Please verify your email address before signing in.");

              // Automatically resend verification email
              sendVerificationEmail({
                email: values.email,
                callbackURL: "/verify-email",
              })
                .then(() => {
                  setVerificationSent(true);
                })
                .catch(console.error);
            } else {
              const errorMessage =
                ctx.error?.message ||
                ctx.error?.body?.message ||
                "Unable to sign in. Please check your details and try again.";
              setError(errorMessage);
            }
          },
        }
      );
    } catch (err: any) {
      console.error("Sign in error:", err);
      const errorMessage =
        err?.body?.message ||
        err?.message ||
        "Unable to sign in. Please check your details and try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to sign in
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {error && !needsVerification && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {needsVerification && (
            <Alert className="border-primary/20 bg-primary/5">
              <Mail className="h-4 w-4 text-primary" />
              <AlertDescription className="space-y-2 text-foreground">
                <p className="font-medium">Email verification required</p>
                {verificationSent ? (
                  <p className="text-sm">
                    We've sent a verification link to{" "}
                    <strong>{verificationEmail}</strong>. Please check your
                    inbox and click the link to verify your account.
                  </p>
                ) : (
                  <p className="text-sm">
                    Your email address needs to be verified before you can sign
                    in.
                  </p>
                )}
                {!verificationSent && (
                  <Button
                    className="mt-2"
                    disabled={resendingVerification}
                    onClick={handleResendVerification}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {resendingVerification
                      ? "Sending..."
                      : "Send Verification Email"}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}
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
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-between text-sm">
        <Link
          className="text-muted-foreground hover:text-foreground hover:underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link
            className="font-medium hover:underline"
            href={
              returnTo !== "/"
                ? `/sign-up?returnTo=${encodeURIComponent(returnTo)}`
                : "/sign-up"
            }
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
