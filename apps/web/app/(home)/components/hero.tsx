"use client";

import { Button } from "@repo/design/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FlowingPixelsCanvas } from "./flowing";

export function Hero() {
  return (
    <main className="relative z-10 overflow-hidden px-6 pt-32 pb-20">
      {/* Dot gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-background to-muted/20 opacity-40 md:opacity-70"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,1) 80%, rgba(0,0,0,1) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,1) 80%, rgba(0,0,0,1) 100%)",
        }}
      >
        <FlowingPixelsCanvas />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl animate-fade-in">
        <div className="max-w-3xl">
          <h1 className="mb-8 font-medium text-5xl text-foreground leading-[1.05] tracking-tight md:text-7xl">
            N2O's monorepo template for rapid development
          </h1>

          <p className="mb-10 max-w-xl font-light text-muted-foreground text-xl leading-relaxed">
            Create a new project in minutes that can be extended and maintained
            for years
          </p>

          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/sign-up">
                Start Building
                <ArrowRight className="size-[18px]" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
