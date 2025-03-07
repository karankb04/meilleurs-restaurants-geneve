import { db } from "@/db";
import { restaurants, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Restaurant = typeof restaurants.$inferSelect;
export type Category = typeof categories.$inferSelect;

export async function getAllRestaurants(): Promise<(Restaurant & { category: Category | null })[]> {
  try {
    const results = await db
      .select()
      .from(restaurants)
      .leftJoin(categories, eq(restaurants.categoryId, categories.id));
    
    return results.map(row => ({
      ...row.restaurants,
      category: row.categories,
    }));
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    return await db.select().from(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getRestaurantById(id: number): Promise<(Restaurant & { category: Category | null }) | null> {
  const restaurant = await db.query.restaurants.findFirst({
    where: eq(restaurants.id, id),
    with: {
      category: true,
    },
  });
  
  return restaurant;
}

export async function getRestaurantBySlug(slug: string): Promise<(Restaurant & { category: Category | null }) | null> {
  try {
    const result = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.slug, slug))
      .leftJoin(categories, eq(restaurants.categoryId, categories.id));
    
    if (result.length === 0) {
      return null;
    }
    
    return {
      ...result[0].restaurants,
      category: result[0].categories,
    };
  } catch (error) {
    console.error("Error fetching restaurant by slug:", error);
    return null;
  }
}

export async function getFeaturedRestaurants(): Promise<(Restaurant & { category: Category | null })[]> {
  try {
    const results = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.isFeatured, 1))
      .leftJoin(categories, eq(restaurants.categoryId, categories.id));
    
    return results.map(row => ({
      ...row.restaurants,
      category: row.categories,
    }));
  } catch (error) {
    console.error("Error fetching featured restaurants:", error);
    return [];
  }
}

export async function getCategoryById(id: string | number) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, String(id)),
    });
    
    return category;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
}
