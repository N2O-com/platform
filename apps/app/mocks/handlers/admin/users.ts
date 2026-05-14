import { HttpResponse, http } from "msw";

export const usersHandlers = [
  http.post("/api/admin/users/:id/ban", () => HttpResponse.json({ ok: true })),
  http.post("/api/admin/users/:id/unban", () =>
    HttpResponse.json({ ok: true })
  ),
  http.post("/api/admin/users/:id/revoke-sessions", () =>
    HttpResponse.json({ ok: true })
  ),
];
