import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

const OnboardLayout = async ({
  children,
}: {
  readonly children: ReactNode;
}) => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.session.activeOrganizationId) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
};

export default OnboardLayout;
