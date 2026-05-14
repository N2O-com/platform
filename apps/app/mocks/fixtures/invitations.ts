import type { Invitation } from "@/lib/db/schemas/main";

export const invitations: Invitation[] = [
  {
    id: "inv_01HXACME_PENDING_001",
    organizationId: "org_01HXACME0000000000000001",
    email: "eve@example.com",
    role: "member",
    status: "pending",
    teamId: null,
    inviterId: "user_01HXADMIN0000000000000001",
    expiresAt: new Date("2026-06-01T00:00:00.000Z"),
    createdAt: new Date("2026-05-01T10:00:00.000Z"),
  },
  {
    id: "inv_01HXACME_PENDING_002",
    organizationId: "org_01HXACME0000000000000001",
    email: "frank@example.com",
    role: "admin",
    status: "pending",
    teamId: "team_01HXACME_PLATFORM",
    inviterId: "user_01HXADMIN0000000000000001",
    expiresAt: new Date("2026-06-05T00:00:00.000Z"),
    createdAt: new Date("2026-05-05T10:00:00.000Z"),
  },
];
