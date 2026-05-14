"use client";

import Link from "next/link";
import { config } from "../config";

export const Header = () => {
  const { appName } = config;

  return (
    <nav className="fixed top-0 z-50 w-full border-border/50 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          className="font-semibold text-foreground text-lg tracking-tight"
          href="/"
        >
          {appName}
        </Link>
        <div className="flex items-center gap-6">
          <Link
            className="hidden font-medium text-foreground text-sm transition-colors hover:text-muted-foreground sm:block"
            href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-in`}
          >
            Sign In
          </Link>
          <Link
            className="rounded-full bg-card px-4 py-2 font-semibold text-card-foreground text-sm transition-colors hover:bg-accent"
            href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};
