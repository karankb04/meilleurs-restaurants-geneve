import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";
import { primaryKey } from "drizzle-orm";

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  color: text("color"), // For UI customization
  icon: text("icon"), // For UI customization
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`),
});

// Rename bookmarks to restaurants
export const restaurants = sqliteTable("restaurants", {
  // Core fields
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  url: text("url"), // Restaurant website
  
  // Restaurant-specific fields
  address: text("address"),
  phone: text("phone"),
  priceRange: text("price_range"), // $ to $$$$
  cuisine: text("cuisine"), // Type of cuisine
  openingHours: text("opening_hours"),
  reservationLink: text("reservation_link"),
  
  // Organization
  categoryId: text("category_id").references(() => categories.id), // For cuisine types
  tags: text("tags"), // Features like "outdoor seating", "takeout", etc.

  // Media
  coverImage: text("cover_image"), // Main restaurant image
  gallery: text("gallery"), // JSON string of image URLs
  menuUrl: text("menu_url"), // Link to menu
  
  // Ratings and reviews
  rating: integer("rating"), // 1-5 stars
  reviewCount: integer("review_count"),
  
  // Location
  latitude: text("latitude"),
  longitude: text("longitude"),
  neighborhood: text("neighborhood"),
  
  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  
  // Additional fields
  notes: text("notes"), // Admin notes
  isArchived: integer("is_archived", { mode: "boolean" })
    .notNull()
    .default(false),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(false),
});

// Relations
export const restaurantsRelations = relations(restaurants, ({ one }) => ({
  category: one(categories, {
    fields: [restaurants.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  restaurants: many(restaurants),
}));

// Type definitions
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;

// Add this new table for collections
export const collections = sqliteTable("collections", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(), // "Best Brunch Spots", "Date Night", "Family Friendly"
  description: text("description"),
  slug: text("slug").notNull().unique(),
  coverImage: text("cover_image"), // Image for the collection
  createdAt: integer("created_at")
    .$defaultFn(() => Math.floor(Date.now() / 1000))
    .notNull(),
  updatedAt: integer("updated_at")
    .$defaultFn(() => Math.floor(Date.now() / 1000))
    .notNull(),
});

// Add a relation between restaurants and collections
export const restaurantCollections = sqliteTable("restaurant_collections", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  restaurantId: integer("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  collectionId: text("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
});

// Add relations for collections
export const collectionsRelations = relations(collections, ({ many }) => ({
  restaurantCollections: many(restaurantCollections),
}));

// Add relations for restaurant collections
export const restaurantCollectionsRelations = relations(restaurantCollections, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantCollections.restaurantId],
    references: [restaurants.id],
  }),
  collection: one(collections, {
    fields: [restaurantCollections.collectionId],
    references: [collections.id],
  }),
}));
