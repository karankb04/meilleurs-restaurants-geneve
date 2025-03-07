import { Container, Section } from "@/components/craft";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { RestaurantCard } from "@/components/restaurant-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: { cuisine?: string; featured?: string };
}) {
  let query = db.query.restaurants;
  
  let restaurantsList;
  
  if (searchParams.featured === 'true') {
    restaurantsList = await query.findMany({
      where: (restaurants, { eq }) => eq(restaurants.isFeatured, 1),
      with: {
        category: true,
      },
    });
  } else if (searchParams.cuisine) {
    restaurantsList = await query.findMany({
      where: (restaurants, { eq }) => eq(restaurants.cuisine, searchParams.cuisine),
      with: {
        category: true,
      },
    });
  } else {
    restaurantsList = await query.findMany({
      orderBy: (restaurants, { desc }) => [desc(restaurants.createdAt)],
      with: {
        category: true,
      },
    });
  }

  // Get unique cuisines for filtering
  const allRestaurants = await query.findMany();
  const cuisines = [...new Set(allRestaurants.map(r => r.cuisine).filter(Boolean))];

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
              <p className="text-muted-foreground">
                Discover amazing places to eat
              </p>
            </div>
            
            {cuisines.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Link href="/restaurants">
                  <Button 
                    variant={!searchParams.cuisine ? "default" : "outline"} 
                    size="sm"
                  >
                    All
                  </Button>
                </Link>
                {cuisines.map((cuisine) => (
                  <Link 
                    key={cuisine} 
                    href={`/restaurants?cuisine=${encodeURIComponent(cuisine!)}`}
                  >
                    <Button 
                      variant={searchParams.cuisine === cuisine ? "default" : "outline"} 
                      size="sm"
                    >
                      {cuisine}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurantsList.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            
            {restaurantsList.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No restaurants found</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
} 