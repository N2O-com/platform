import type { Member } from "@/lib/db/schemas/main";

export const members: Member[] = [
  {
    id: "mem_01HXACME_ADA",
    organizationId: "org_01HXACME0000000000000001",
    userId: "user_01HXADMIN0000000000000001",
    role: "owner",
    createdAt: new Date("2025-01-10T08:00:00.000Z"),
  },
  {
    id: "mem_01HXACME_BRUNO",
    organizationId: "org_01HXACME0000000000000001",
    userId: "user_01HXMEMBER000000000000001",
    role: "admin",
    createdAt: new Date("2025-02-13T09:00:00.000Z"),
  },
  {
    id: "mem_01HXACME_CLEO",
    organizationId: "org_01HXACME0000000000000001",
    userId: "user_01HXMEMBER000000000000002",
    role: "member",
    createdAt: new Date("2025-03-02T12:00:00.000Z"),
  },
  {
    id: "mem_01HXNORTH_ADA",
    organizationId: "org_01HXNORTH00000000000001",
    userId: "user_01HXADMIN0000000000000001",
    role: "owner",
    createdAt: new Date("2025-03-21T16:20:00.000Z"),
  },
];
