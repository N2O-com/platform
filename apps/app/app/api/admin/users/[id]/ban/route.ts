import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";

const bodySchema = z.object({
  reason: z.string().max(500).optional(),
  expiresIn: z.number().int().positive().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    await auth.api.banUser({
      headers: guard.headers,
      body: {
        userId: id,
        banReason: parsed.data.reason,
        banExpiresIn: parsed.data.expiresIn,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to ban user" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
