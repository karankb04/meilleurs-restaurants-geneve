import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Initialize the Turso/LibSQL client
const client = createClient({
  url: process.env.DATABASE_URL || "file:./sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Create the database connection
export const db = drizzle(client, { schema }); 