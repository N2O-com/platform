import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;

  try {
    await auth.api.revokeUserSessions({
      headers: guard.headers,
      body: { userId: id },
    });
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Failed to revoke sessions",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
