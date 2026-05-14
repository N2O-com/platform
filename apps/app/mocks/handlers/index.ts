import { organizationsHandlers } from "./admin/organizations";
import { overviewHandlers } from "./admin/overview";
import { usersHandlers } from "./admin/users";

// Order matters: more specific routes should come before catch-alls.
// Auth routes (/api/auth/*) are intentionally NOT mocked — they pass through
// to better-auth so login/session logic exercises the real flow.
export const handlers = [
  ...overviewHandlers,
  ...organizationsHandlers,
  ...usersHandlers,
];
