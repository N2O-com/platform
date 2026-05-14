"use client";

import { organization } from "@repo/auth/client";
import { Alert, AlertDescription } from "@repo/design/components/ui/alert";
import { Button } from "@repo/design/components/ui/button";
import { AlertCircle } from "lucide-react";
import * as React from "react";

type Props = {
  invitationId: string;
  organizationName: string;
  role: string;
  email: string;
  currentUserEmail: string;
};

export const AcceptInvitationClient = ({
  invitationId,
  organizationName,
  role,
  email,
  currentUserEmail,
}: Props) => {
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const emailMismatch = email.toLowerCase() !== currentUserEmail.toLowerCase();

  const handle = async (mode: "accept" | "reject") => {
    setBusy(true);
    setError(null);
    try {
      const result =
        mode === "accept"
          ? await organization.acceptInvitation({ invitationId })
          : await organization.rejectInvitation({ invitationId });
      if (result?.error) {
        throw new Error(result.error.message ?? "Failed");
      }
      if (mode === "accept") {
        const orgId = result?.data?.invitation?.organizationId;
        if (orgId) {
          await organization.setActive({ organizationId: orgId });
        }
        window.location.href = "/";
      } else {
        window.location.href = "/onboard";
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          Join {organizationName}
        </h1>
        <p className="text-muted-foreground text-sm">
          You've been invited as a <strong>{role}</strong>.
        </p>
      </div>

      {emailMismatch && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            This invitation was sent to <strong>{email}</strong> but you're
            signed in as <strong>{currentUserEmail}</strong>. Sign in with the
            invited email to accept.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={busy || emailMismatch}
          onClick={() => handle("accept")}
        >
          {busy ? "Accepting..." : "Accept invitation"}
        </Button>
        <Button
          className="w-full"
          disabled={busy}
          onClick={() => handle("reject")}
          variant="ghost"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
