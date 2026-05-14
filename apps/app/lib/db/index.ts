import { createDb } from "@repo/database";
import type { Database } from "./schemas/main";

export const database = createDb<Database>();

export * from "./schemas/main";
