import { Container, Section } from "@/components/craft";
import { db } from "@/db";
import { collections, restaurantCollections, restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { RestaurantCard } from "@/components/restaurant-card";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;

  const collection = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
  });

  if (!collection) {
    return notFound();
  }

  // Get all restaurants in this collection
  const restaurantIds = await db
    .select({ restaurantId: restaurantCollections.restaurantId })
    .from(restaurantCollections)
    .where(eq(restaurantCollections.collectionId, collection.id));

  const collectionRestaurants = await db.query.restaurants.findMany({
    where: (restaurants, { inArray }) => 
      inArray(
        restaurants.id, 
        restaurantIds.map(r => r.restaurantId)
      ),
    with: {
      category: true,
    },
  });

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
              <p className="text-muted-foreground">
                {collection.description}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collectionRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            
            {collectionRestaurants.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No restaurants in this collection yet</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
} 