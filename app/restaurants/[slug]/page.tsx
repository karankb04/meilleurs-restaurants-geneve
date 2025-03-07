import { Container, Section, Main } from "@/components/craft";
import { db } from "@/db";
import { restaurants, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Globe, Star, Utensils } from "lucide-react";
import { Metadata } from "next";
import { getRestaurantBySlug } from "@/lib/data";
import Link from "next/link";

interface RestaurantPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const restaurant = await getRestaurantBySlug(params.slug);

  if (!restaurant) {
    notFound();
  }

  return {
    title: `${restaurant.name} | GastroGenève`,
    description: restaurant.description || "Détails du restaurant",
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await getRestaurantBySlug(params.slug);

  if (!restaurant) {
    notFound();
  }

  // Parse gallery if it exists
  const galleryImages = restaurant.gallery ? JSON.parse(restaurant.gallery) : [];

  return (
    <Main>
      <div className="relative h-[50vh] w-full">
        {restaurant.coverImage ? (
          <Image
            src={restaurant.coverImage}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      <Section className="-mt-20 relative z-10">
        <Container>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                {restaurant.cuisine && (
                  <Badge variant="outline" className="mt-2">
                    {restaurant.cuisine}
                  </Badge>
                )}
                <p className="mt-4 text-muted-foreground">{restaurant.description}</p>
                
                {restaurant.rating && (
                  <div className="flex items-center mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < restaurant.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} 
                      />
                    ))}
                    {restaurant.reviewCount && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {restaurant.reviewCount} avis
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {galleryImages.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Galerie</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${restaurant.name} image de galerie ${index + 1}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Informations</h2>
                <div className="space-y-4">
                  {restaurant.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Adresse</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {restaurant.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Téléphone</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {restaurant.openingHours && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Horaires</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{restaurant.openingHours}</p>
                      </div>
                    </div>
                  )}
                  
                  {restaurant.url && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Site web</h3>
                        <a
                          href={restaurant.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Visiter le site
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {restaurant.cuisine && (
                    <div className="flex items-start gap-3">
                      <Utensils className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Cuisine</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-lg space-y-4">
                {restaurant.reservationLink && (
                  <Button className="w-full" size="lg" asChild>
                    <a 
                      href={restaurant.reservationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Réserver une table
                    </a>
                  </Button>
                )}
                
                {restaurant.menuUrl && (
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <a 
                      href={restaurant.menuUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Voir le menu
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
} 