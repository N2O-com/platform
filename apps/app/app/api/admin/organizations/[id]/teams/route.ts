import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { database } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;

  const parsed = createSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const organization = await database
    .selectFrom("organization")
    .select("id")
    .where("id", "=", id)
    .executeTakeFirst();
  if (!organization) {
    return NextResponse.json(
      { message: "Organization not found" },
      { status: 404 }
    );
  }

  const team = await database
    .insertInto("team")
    .values({ name: parsed.data.name, organizationId: id })
    .returningAll()
    .executeTakeFirstOrThrow();

  return NextResponse.json({ team }, { status: 201 });
}
