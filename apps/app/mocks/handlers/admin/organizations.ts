import { HttpResponse, http } from "msw";
import {
  invitations,
  members,
  organizations,
  teams,
  users,
} from "../../fixtures";

const findOrg = (id: string) => organizations.find((o) => o.id === id);

export const organizationsHandlers = [
  http.get("/api/admin/organizations", () => {
    const rows = organizations.reduce<
      Array<{
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        createdAt: Date;
        memberCount: number;
      }>
    >((acc, org) => {
      let memberCount = 0;
      for (const m of members) {
        if (m.organizationId === org.id) memberCount++;
      }
      acc.push({
        id: org.id,
        name: org.name,
        slug: org.slug,
        logo: org.logo,
        createdAt: org.createdAt,
        memberCount,
      });
      return acc;
    }, []);
    rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return HttpResponse.json({ organizations: rows });
  }),

  http.post("/api/admin/organizations", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      slug?: string;
    };
    const name = body.name?.trim();
    const slug = body.slug?.trim();
    if (!name || name.length < 2) {
      return HttpResponse.json(
        { message: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }
    if (!(slug && /^[a-z0-9-]+$/i.test(slug))) {
      return HttpResponse.json(
        { message: "Letters, numbers, and dashes only." },
        { status: 400 }
      );
    }
    if (organizations.some((o) => o.slug === slug)) {
      return HttpResponse.json(
        { message: "Slug is already in use" },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      {
        organization: {
          id: `org_mock_${Date.now()}`,
          name,
          slug,
          logo: null,
          metadata: null,
          createdAt: new Date(),
        },
      },
      { status: 201 }
    );
  }),

  http.get("/api/admin/organizations/:id", ({ params }) => {
    const id = String(params.id);
    const organization = findOrg(id);
    if (!organization) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }

    const orgMembers = members.reduce<
      Array<{
        id: string;
        role: string;
        createdAt: Date;
        userId: string;
        userName: string;
        userEmail: string;
        userImage: string | null;
      }>
    >((acc, m) => {
      if (m.organizationId !== id) return acc;
      const u = users.find((user) => user.id === m.userId);
      acc.push({
        id: m.id,
        role: m.role,
        createdAt: m.createdAt,
        userId: m.userId,
        userName: u?.name ?? "Unknown",
        userEmail: u?.email ?? "unknown@example.com",
        userImage: u?.image ?? null,
      });
      return acc;
    }, []);
    orgMembers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const orgInvitations = invitations
      .filter((i) => i.organizationId === id && i.status === "pending")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const orgTeams = teams
      .filter((t) => t.organizationId === id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return HttpResponse.json({
      organization,
      members: orgMembers,
      invitations: orgInvitations,
      teams: orgTeams,
    });
  }),

  http.delete("/api/admin/organizations/:id", () =>
    HttpResponse.json({ ok: true })
  ),

  http.post(
    "/api/admin/organizations/:id/teams",
    async ({ request, params }) => {
      const id = String(params.id);
      if (!findOrg(id)) {
        return HttpResponse.json(
          { message: "Organization not found" },
          { status: 404 }
        );
      }
      const body = (await request.json().catch(() => ({}))) as {
        name?: string;
      };
      const name = body.name?.trim();
      if (!name) {
        return HttpResponse.json(
          { message: "Name is required" },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        {
          team: {
            id: `team_mock_${Date.now()}`,
            name,
            organizationId: id,
            createdAt: new Date(),
            updatedAt: null,
          },
        },
        { status: 201 }
      );
    }
  ),

  http.patch(
    "/api/admin/organizations/:id/teams/:teamId",
    async ({ request }) => {
      const body = (await request.json().catch(() => ({}))) as {
        name?: string;
      };
      if (!body.name?.trim()) {
        return HttpResponse.json(
          { message: "Name is required" },
          { status: 400 }
        );
      }
      return HttpResponse.json({ ok: true });
    }
  ),

  http.delete("/api/admin/organizations/:id/teams/:teamId", () =>
    HttpResponse.json({ ok: true })
  ),

  http.patch(
    "/api/admin/organizations/:id/members/:memberId",
    async ({ request }) => {
      const body = (await request.json().catch(() => ({}))) as {
        role?: string;
      };
      if (!(body.role && ["owner", "admin", "member"].includes(body.role))) {
        return HttpResponse.json({ message: "Invalid role" }, { status: 400 });
      }
      return HttpResponse.json({ ok: true });
    }
  ),

  http.delete("/api/admin/organizations/:id/members/:memberId", () =>
    HttpResponse.json({ ok: true })
  ),

  http.delete("/api/admin/organizations/:id/invitations/:invitationId", () =>
    HttpResponse.json({ ok: true })
  ),
];
