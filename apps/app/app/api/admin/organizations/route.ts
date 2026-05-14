import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { database } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .max(100)
    .regex(/^[a-z0-9-]+$/i, "Letters, numbers, and dashes only."),
});

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const rows = await database
    .selectFrom("organization as o")
    .leftJoin("member as m", "m.organizationId", "o.id")
    .select([
      "o.id",
      "o.name",
      "o.slug",
      "o.logo",
      "o.createdAt",
      (eb) => eb.fn.count<number>("m.id").as("memberCount"),
    ])
    .groupBy(["o.id", "o.name", "o.slug", "o.logo", "o.createdAt"])
    .orderBy("o.createdAt", "desc")
    .execute();

  return NextResponse.json({ organizations: rows });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const parsed = createSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await database
    .selectFrom("organization")
    .select("id")
    .where("slug", "=", parsed.data.slug)
    .executeTakeFirst();
  if (existing) {
    return NextResponse.json(
      { message: "Slug is already in use" },
      { status: 409 }
    );
  }

  const organization = await database
    .insertInto("organization")
    .values({ name: parsed.data.name, slug: parsed.data.slug })
    .returningAll()
    .executeTakeFirstOrThrow();

  return NextResponse.json({ organization }, { status: 201 });
}
