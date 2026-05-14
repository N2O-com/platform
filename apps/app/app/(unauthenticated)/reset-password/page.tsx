import { ResetPasswordForm } from "@repo/design/components/custom/auth/reset-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your account.",
};

export default function Page() {
  return <ResetPasswordForm />;
}
