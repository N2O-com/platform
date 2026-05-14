import { Spinner } from "@repo/design/components/ui/spinner";
import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailClient } from "./client";

export const metadata: Metadata = {
  title: "Verify email",
  description: "Confirm your email address to finish signing up.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Spinner className="size-8" />
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
