import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { database } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;

  const [organization, members, invitations, teams] = await Promise.all([
    database
      .selectFrom("organization")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst(),
    database
      .selectFrom("member as m")
      .innerJoin("user as u", "u.id", "m.userId")
      .select([
        "m.id",
        "m.role",
        "m.createdAt",
        "u.id as userId",
        "u.name as userName",
        "u.email as userEmail",
        "u.image as userImage",
      ])
      .where("m.organizationId", "=", id)
      .orderBy("m.createdAt", "asc")
      .execute(),
    database
      .selectFrom("invitation")
      .selectAll()
      .where("organizationId", "=", id)
      .where("status", "=", "pending")
      .orderBy("createdAt", "desc")
      .execute(),
    database
      .selectFrom("team")
      .selectAll()
      .where("organizationId", "=", id)
      .orderBy("createdAt", "asc")
      .execute(),
  ]);

  if (!organization) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ organization, members, invitations, teams });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;

  await database.deleteFrom("organization").where("id", "=", id).execute();
  return NextResponse.json({ ok: true });
}
