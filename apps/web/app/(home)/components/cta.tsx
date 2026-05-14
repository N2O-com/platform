import { Button } from "@repo/design/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-32 text-center">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="mb-8 font-medium text-3xl text-foreground tracking-tight md:text-4xl">
          Ready to get started?
        </h2>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
