import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { database } from "@/lib/db";

const patchSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id, memberId } = await params;

  const parsed = patchSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const result = await database
    .updateTable("member")
    .set({ role: parsed.data.role })
    .where("id", "=", memberId)
    .where("organizationId", "=", id)
    .executeTakeFirst();

  if (Number(result.numUpdatedRows ?? 0) === 0) {
    return NextResponse.json({ message: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id, memberId } = await params;

  const result = await database
    .deleteFrom("member")
    .where("id", "=", memberId)
    .where("organizationId", "=", id)
    .executeTakeFirst();

  if (Number(result.numDeletedRows ?? 0) === 0) {
    return NextResponse.json({ message: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
