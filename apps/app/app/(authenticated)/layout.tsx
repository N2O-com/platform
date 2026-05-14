import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!session.session.activeOrganizationId) {
    redirect("/onboard");
  }

  return <main className="min-h-screen bg-background">{children}</main>;
};

export default AppLayout;
