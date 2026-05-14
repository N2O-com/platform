import { createAuthHandlers } from "@repo/auth/handlers";
import { auth } from "@/lib/auth";

export const { GET, POST } = createAuthHandlers(auth);
