import { Alert, AlertDescription } from "@repo/design/components/ui/alert";
import { Button } from "@repo/design/components/ui/button";
import { AlertCircle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AcceptInvitationClient } from "./client";

const AcceptInvitationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user) {
    const returnTo = encodeURIComponent(`/accept-invitation/${id}`);
    redirect(`/sign-up?returnTo=${returnTo}`);
  }

  let invitation;
  try {
    invitation = await auth.api.getInvitation({
      headers: h,
      query: { id },
    });
  } catch {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This invitation is invalid or has expired.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/">Continue</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <AcceptInvitationClient
          currentUserEmail={session.user.email}
          email={invitation?.email ?? session.user.email}
          invitationId={id}
          organizationName={invitation?.organizationName ?? "this workspace"}
          role={invitation?.role ?? "member"}
        />
      </div>
    </main>
  );
};

export default AcceptInvitationPage;
