import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { nanoid } from "nanoid";
import * as schema from "./schema";

// Initialize the Turso/LibSQL client
const client = createClient({
  url: process.env.DATABASE_URL || "file:./sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Create the database connection
const db = drizzle(client, { schema });

// Seed data
async function seed() {
  console.log("Seeding database...");
  
  try {
    // Add categories
    const categories = [
      {
        id: nanoid(),
        name: "Italian",
        description: "Italian cuisine",
        slug: "italian",
        color: "#FF5733",
        icon: "pizza",
      },
      {
        id: nanoid(),
        name: "Mexican",
        description: "Mexican cuisine",
        slug: "mexican",
        color: "#33FF57",
        icon: "taco",
      },
      {
        id: nanoid(),
        name: "Japanese",
        description: "Japanese cuisine",
        slug: "japanese",
        color: "#3357FF",
        icon: "sushi",
      },
    ];
    
    for (const category of categories) {
      await db.insert(schema.categories).values(category);
    }
    console.log("Added categories");
    
    // Add restaurants
    const restaurants = [
      {
        name: "Pasta Paradise",
        slug: "pasta-paradise",
        description: "Authentic Italian pasta dishes made with fresh ingredients.",
        url: "https://example.com/pasta-paradise",
        address: "123 Main St, Anytown, USA",
        phone: "(555) 123-4567",
        priceRange: "$$",
        cuisine: "Italian",
        openingHours: "Mon-Fri: 11am-10pm\nSat-Sun: 12pm-11pm",
        categoryId: categories[0].id,
        coverImage: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85",
        isFeatured: 1,
        rating: 4,
        reviewCount: 128,
      },
      {
        name: "Taco Town",
        slug: "taco-town",
        description: "Authentic Mexican street tacos and more.",
        url: "https://example.com/taco-town",
        address: "456 Oak St, Anytown, USA",
        phone: "(555) 234-5678",
        priceRange: "$",
        cuisine: "Mexican",
        openingHours: "Mon-Sun: 10am-11pm",
        categoryId: categories[1].id,
        coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
        isFeatured: 1,
        rating: 5,
        reviewCount: 256,
      },
      {
        name: "Sushi Spot",
        slug: "sushi-spot",
        description: "Fresh and creative sushi rolls and Japanese dishes.",
        url: "https://example.com/sushi-spot",
        address: "789 Pine St, Anytown, USA",
        phone: "(555) 345-6789",
        priceRange: "$$$",
        cuisine: "Japanese",
        openingHours: "Tue-Sun: 5pm-10pm\nClosed Mondays",
        categoryId: categories[2].id,
        coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        isFeatured: 0,
        rating: 4,
        reviewCount: 92,
      },
    ];
    
    for (const restaurant of restaurants) {
      await db.insert(schema.restaurants).values(restaurant);
    }
    console.log("Added restaurants");
    
    // Add collections
    const collections = [
      {
        id: nanoid(),
        name: "Date Night Spots",
        description: "Perfect restaurants for a romantic evening",
        slug: "date-night",
        coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        name: "Family Friendly",
        description: "Great places to eat with the whole family",
        slug: "family-friendly",
        coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        name: "Best Brunch",
        description: "Top spots for weekend brunch",
        slug: "best-brunch",
        coverImage: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    for (const collection of collections) {
      await db.insert(schema.collections).values(collection);
    }
    console.log("Added collections");
    
    // Get restaurant IDs
    const restaurantRows = await db.select().from(schema.restaurants);
    
    // Add restaurants to collections
    const restaurantCollections = [
      {
        id: nanoid(),
        restaurantId: restaurantRows[0].id,
        collectionId: collections[0].id,
      },
      {
        id: nanoid(),
        restaurantId: restaurantRows[2].id,
        collectionId: collections[0].id,
      },
      {
        id: nanoid(),
        restaurantId: restaurantRows[1].id,
        collectionId: collections[1].id,
      },
      {
        id: nanoid(),
        restaurantId: restaurantRows[0].id,
        collectionId: collections[2].id,
      },
    ];
    
    for (const rc of restaurantCollections) {
      await db.insert(schema.restaurantCollections).values(rc);
    }
    console.log("Added restaurant-collection relationships");
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seed();
