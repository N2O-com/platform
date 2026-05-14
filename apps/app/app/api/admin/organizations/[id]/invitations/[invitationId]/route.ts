import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { database } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id, invitationId } = await params;

  await database
    .updateTable("invitation")
    .set({ status: "canceled" })
    .where("id", "=", invitationId)
    .where("organizationId", "=", id)
    .execute();

  return NextResponse.json({ ok: true });
}
