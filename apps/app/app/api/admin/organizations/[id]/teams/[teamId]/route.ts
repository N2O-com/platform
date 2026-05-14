import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { database } from "@/lib/db";

const patchSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; teamId: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id, teamId } = await params;

  const parsed = patchSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const result = await database
    .updateTable("team")
    .set({ name: parsed.data.name, updatedAt: new Date() })
    .where("id", "=", teamId)
    .where("organizationId", "=", id)
    .executeTakeFirst();

  if (Number(result.numUpdatedRows ?? 0) === 0) {
    return NextResponse.json({ message: "Team not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; teamId: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id, teamId } = await params;

  await database
    .deleteFrom("team")
    .where("id", "=", teamId)
    .where("organizationId", "=", id)
    .execute();

  return NextResponse.json({ ok: true });
}
