"use client";

import { useState, useEffect } from "react";
import { Container, Section } from "@/components/craft";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine?: string;
}

export default function ManageCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, restaurantsRes] = await Promise.all([
          fetch("/api/collections").then(res => res.json()),
          fetch("/api/restaurants").then(res => res.json())
        ]);
        
        setCollections(collectionsRes);
        setRestaurants(restaurantsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/collections/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: parseInt(selectedRestaurant),
          collectionId: selectedCollection,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add restaurant to collection");
      }

      toast.success("Restaurant added to collection");
      setSelectedRestaurant("");
      // Keep the same collection selected for convenience
    } catch (error) {
      toast.error("Failed to add restaurant to collection");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manage Collections</h1>
              <p className="text-muted-foreground">
                Add restaurants to collections
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Add to Collection</CardTitle>
                <CardDescription>
                  Select a restaurant and a collection to add it to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="collection">Collection</Label>
                    <Select
                      value={selectedCollection}
                      onValueChange={setSelectedCollection}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="restaurant">Restaurant</Label>
                    <Select
                      value={selectedRestaurant}
                      onValueChange={setSelectedRestaurant}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                            {restaurant.name} {restaurant.cuisine ? `(${restaurant.cuisine})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add to Collection"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
} 