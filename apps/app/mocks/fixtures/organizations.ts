import type { Organization } from "@/lib/db/schemas/main";

export const organizations: Organization[] = [
  {
    id: "org_01HXACME0000000000000001",
    name: "Acme Corp",
    slug: "acme",
    logo: null,
    metadata: null,
    createdAt: new Date("2025-01-10T08:00:00.000Z"),
  },
  {
    id: "org_01HXNORTH00000000000001",
    name: "North Star Labs",
    slug: "north-star-labs",
    logo: null,
    metadata: null,
    createdAt: new Date("2025-03-21T16:20:00.000Z"),
  },
];
