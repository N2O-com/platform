import { SignInForm } from "@repo/design/components/custom/auth/sign-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account.",
};

export default function Page() {
  return <SignInForm />;
}
