import "server-only";

import { toNextJsHandler } from "better-auth/next-js";
import type { Auth } from "./server";

export const createAuthHandlers = (auth: Auth) => toNextJsHandler(auth);
