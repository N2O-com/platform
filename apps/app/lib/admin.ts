import "server-only";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function requireAdmin() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    } as const;
  }
  if (session.user.role !== "admin") {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    } as const;
  }
  return { session, headers: h } as const;
}
