import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Initialize the Turso/LibSQL client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./sqlite.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create the database connection
export const db = drizzle(client, { schema }); 