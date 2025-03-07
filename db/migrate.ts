import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

// Initialize the Turso/LibSQL client
const client = createClient({
  url: process.env.DATABASE_URL || "file:./sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Create the database connection
const db = drizzle(client, { schema });

// Run migrations
async function runMigrations() {
  console.log("Running migrations...");
  
  try {
    // Create categories table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        slug TEXT NOT NULL UNIQUE,
        color TEXT,
        icon TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER
      )
    `);
    console.log("Created categories table");

    // Create restaurants table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        url TEXT,
        address TEXT,
        phone TEXT,
        price_range TEXT,
        cuisine TEXT,
        opening_hours TEXT,
        reservation_link TEXT,
        category_id TEXT REFERENCES categories(id),
        tags TEXT,
        cover_image TEXT,
        gallery TEXT,
        menu_url TEXT,
        rating INTEGER,
        review_count INTEGER,
        latitude TEXT,
        longitude TEXT,
        neighborhood TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        notes TEXT,
        is_archived INTEGER NOT NULL DEFAULT 0,
        is_featured INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log("Created restaurants table");

    // Create collections table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        slug TEXT NOT NULL UNIQUE,
        cover_image TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);
    console.log("Created collections table");

    // Create restaurant_collections table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurant_collections (
        id TEXT PRIMARY KEY,
        restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE
      )
    `);
    console.log("Created restaurant_collections table");

    console.log("All migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
  }
}

runMigrations(); 