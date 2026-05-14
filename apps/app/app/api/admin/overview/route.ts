import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { database } from "@/lib/db";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const [
    users,
    verified,
    banned,
    organizations,
    pendingInvites,
    activeSessions,
  ] = await Promise.all([
    database
      .selectFrom("user")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .executeTakeFirst(),
    database
      .selectFrom("user")
      .where("emailVerified", "=", true)
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .executeTakeFirst(),
    database
      .selectFrom("user")
      .where("banned", "=", true)
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .executeTakeFirst(),
    database
      .selectFrom("organization")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .executeTakeFirst(),
    database
      .selectFrom("invitation")
      .where("status", "=", "pending")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .executeTakeFirst(),
    database
      .selectFrom("session")
      .where("expiresAt", ">", new Date())
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .executeTakeFirst(),
  ]);

  return NextResponse.json({
    users: Number(users?.count ?? 0),
    verifiedUsers: Number(verified?.count ?? 0),
    bannedUsers: Number(banned?.count ?? 0),
    organizations: Number(organizations?.count ?? 0),
    pendingInvitations: Number(pendingInvites?.count ?? 0),
    activeSessions: Number(activeSessions?.count ?? 0),
  });
}
