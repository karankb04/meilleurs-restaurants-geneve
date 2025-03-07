"use client";

import Link from "next/link";
import Image from "next/image";
import { Restaurant, Category } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantCardProps {
  restaurant: Restaurant & { category: Category | null };
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video">
        {restaurant.coverImage ? (
          <Image
            src={restaurant.coverImage}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <CardContent className="py-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
        
        {restaurant.address && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {restaurant.description || "Pas de description disponible"}
        </p>
      </CardContent>
      
      <CardFooter className="mt-auto">
        <Link href={`/restaurants/${restaurant.slug}`} className="w-full">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" type="button">
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 