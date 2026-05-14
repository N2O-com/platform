import { ForgotPasswordForm } from "@repo/design/components/custom/auth/forgot-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a link to reset your password.",
};

export default function Page() {
  return <ForgotPasswordForm />;
}
