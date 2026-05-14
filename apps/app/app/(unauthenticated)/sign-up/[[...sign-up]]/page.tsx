import { SignUpForm } from "@repo/design/components/custom/auth/sign-up";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a new account.",
};

export default function Page() {
  return <SignUpForm />;
}
