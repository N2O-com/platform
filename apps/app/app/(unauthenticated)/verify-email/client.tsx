"use client";

import { Alert, AlertDescription } from "@repo/design/components/ui/alert";
import { Button } from "@repo/design/components/ui/button";
import { Spinner } from "@repo/design/components/ui/spinner";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useReducer } from "react";

type State =
  | { status: "loading"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialState: State = { status: "loading", message: "" };

export function VerifyEmailClient() {
  const { get } = useSearchParams();
  const { push } = useRouter();
  const [state, setState] = useReducer(
    (_prev: State, next: State) => next,
    initialState
  );

  useEffect(() => {
    const error = get("error");
    const next: State = error
      ? {
          status: "error",
          message:
            error === "invalid_token" || error === "INVALID_TOKEN"
              ? "This verification link is invalid or has expired."
              : "An error occurred during verification.",
        }
      : {
          status: "success",
          message: "Your email has been verified successfully!",
        };
    setState(next);

    if (next.status === "success") {
      const timeout = setTimeout(() => {
        push("/onboard");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [get, push]);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          Email Verification
        </h1>
      </div>

      {state.status === "loading" && (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Spinner className="size-8" />
          <p className="text-muted-foreground text-sm">Verifying your email…</p>
        </div>
      )}

      {state.status === "success" && (
        <Alert className="border-success/20 bg-success/5">
          <CheckCircle className="size-4 text-success" />
          <AlertDescription className="text-success">
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.status === "success" && (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground text-sm">
            Setting up your workspace…
          </p>
          <Button asChild className="w-full">
            <Link href="/onboard">Continue</Link>
          </Button>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/sign-up">Back to Sign Up</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link href="/sign-in">Go to Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
