import type { Team } from "@/lib/db/schemas/main";

export const teams: Team[] = [
  {
    id: "team_01HXACME_PLATFORM",
    name: "Platform",
    organizationId: "org_01HXACME0000000000000001",
    createdAt: new Date("2025-01-15T08:00:00.000Z"),
    updatedAt: null,
  },
  {
    id: "team_01HXACME_GROWTH",
    name: "Growth",
    organizationId: "org_01HXACME0000000000000001",
    createdAt: new Date("2025-02-10T08:00:00.000Z"),
    updatedAt: new Date("2025-04-01T08:00:00.000Z"),
  },
];
