import type { Metadata } from "next";
import { Cases } from "./components/cases";
import { CTA } from "./components/cta";
import { Hero } from "./components/hero";

export const metadata: Metadata = {
  title: "N2O — Monorepo template for rapid development",
  description:
    "Create a new project in minutes that can be extended and maintained for years.",
};

export default function Home() {
  return (
    <div className="bg-background text-foreground antialiased">
      <Hero />
      <Cases />
      <CTA />
    </div>
  );
}
