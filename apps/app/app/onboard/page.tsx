import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { OnboardClient } from "./client";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Join a workspace or create your own.",
};

const OnboardPage = async () => {
  const h = await headers();
  const invitations = await auth.api
    .listUserInvitations({ headers: h })
    .catch(
      () => [] as Awaited<ReturnType<typeof auth.api.listUserInvitations>>
    );

  const pending = (invitations ?? []).filter((i) => i.status === "pending");

  return <OnboardClient invitations={pending} />;
};

export default OnboardPage;
