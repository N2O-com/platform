import { Check } from "lucide-react";

export function Cases() {
  return (
    <section className="mt-24 border-border/30 border-y bg-muted/20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
        <div className="border-border/30 border-b px-6 py-24 md:border-r md:border-b-0 md:pr-12">
          <h2 className="mb-6 font-medium text-3xl text-foreground tracking-tight">
            Designed for developers
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            All of the tools you need, nothing you don't.
          </p>
          <ul className="space-y-4 text-foreground text-sm">
            <li className="flex items-center gap-3">
              <Check className="size-4 text-constructive" />
              Robust authentication with Better Auth
            </li>
            <li className="flex items-center gap-3">
              <Check className="size-4 text-constructive" />
              Builtin caching with Turborepo
            </li>
            <li className="flex items-center gap-3">
              <Check className="size-4 text-constructive" />
              Full query type safety with Kysely
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto bg-background px-6 py-10 font-mono text-muted-foreground text-sm leading-7 md:pl-12">
          <pre className="text-sm">
            <code>
              <span className="text-primary">import</span> {"{ "}
              <span className="text-constructive">betterAuth</span> {"}"}{" "}
              <span className="text-primary">from</span>{" "}
              <span className="text-constructive">&quot;better-auth&quot;</span>
              ;
              <br />
              <span className="text-primary">import</span> {"{ "}
              <span className="text-constructive">database</span> {"}"}{" "}
              <span className="text-primary">from</span>{" "}
              <span className="text-constructive">
                &quot;@repo/database&quot;
              </span>
              ;
              <br />
              <br />
              <span className="text-primary">export const</span>{" "}
              <span className="text-foreground">auth</span> ={" "}
              <span className="text-constructive">betterAuth</span>({"{"}
              <br />
              {"  "}
              <span className="text-primary">database</span>,
              <br />
              {"  "}
              <span className="text-primary">plugins</span>: [
              <span className="text-constructive">nextCookies</span>()],
              <br />
              {"}"});
            </code>
          </pre>

          <div className="mt-8 border-border/50 border-t pt-8">
            <pre className="text-sm">
              <code>
                {"{"}
                <br />
                {"  "}
                <span className="text-primary">&quot;scripts&quot;</span>: {"{"}
                <br />
                {"    "}
                <span className="text-primary">&quot;build&quot;</span>:{" "}
                <span className="text-constructive">
                  &quot;turbo build&quot;
                </span>
                ,
                <br />
                {"    "}
                <span className="text-primary">&quot;dev&quot;</span>:{" "}
                <span className="text-constructive">&quot;turbo dev&quot;</span>
                ,
                <br />
                {"    "}
                <span className="text-primary">&quot;migrate:dev&quot;</span>:{" "}
                <span className="text-constructive">
                  &quot;pnpm --filter @repo/database migrate:dev&quot;
                </span>
                <br />
                {"  "}
                {"}"}
                <br />
                {"}"}
              </code>
            </pre>
          </div>

          <div className="mt-8 border-border/50 border-t pt-8">
            <pre className="text-sm">
              <code>
                <span className="text-primary">export interface</span>{" "}
                <span className="text-foreground">UserTable</span> {"{"}
                <br />
                {"  "}
                <span className="text-primary">id</span>:{" "}
                <span className="text-constructive">Generated</span>&lt;
                <span className="text-primary">string</span>&gt;;
                <br />
                {"  "}
                <span className="text-primary">name</span>:{" "}
                <span className="text-primary">string</span>;
                <br />
                {"  "}
                <span className="text-primary">email</span>:{" "}
                <span className="text-primary">string</span>;
                <br />
                {"  "}
                <span className="text-primary">createdAt</span>:{" "}
                <span className="text-constructive">Generated</span>&lt;
                <span className="text-primary">Date</span>&gt;;
                <br />
                {"}"}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
