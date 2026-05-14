import { HttpResponse, http } from "msw";
import { invitations, organizations, users } from "../../fixtures";

export const overviewHandlers = [
  http.get("/api/admin/overview", () => {
    const now = Date.now();
    return HttpResponse.json({
      users: users.length,
      verifiedUsers: users.filter((u) => u.emailVerified).length,
      bannedUsers: users.filter((u) => u.banned).length,
      organizations: organizations.length,
      pendingInvitations: invitations.filter((i) => i.status === "pending")
        .length,
      // active sessions are not modeled as fixtures; report a stable mocked value
      activeSessions: users.filter(
        (u) => !u.banned && u.emailVerified && u.createdAt.getTime() < now
      ).length,
    });
  }),
];
