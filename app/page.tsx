// React + Next Imports
import React from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

// Database Imports
import { getAllRestaurants, getAllCategories, getFeaturedRestaurants } from "@/lib/data";
import { db } from "@/db";
import { collections } from "@/db/schema";

// Component Imports
import { Main, Section, Container } from "@/components/craft";
import { CategoryFilter } from "@/components/category-filter";
import { EmailForm } from "@/components/email-form";
import { RestaurantCard } from "@/components/restaurant-card";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";

import Balancer from "react-wrap-balancer";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const [restaurants, categories, featuredRestaurants] = await Promise.all([
    getAllRestaurants(),
    getAllCategories(),
    getFeaturedRestaurants(),
  ]);

  const filteredRestaurants = restaurants
    .filter(
      (restaurant) =>
        !searchParams.category ||
        restaurant.category?.id.toString() === searchParams.category,
    )
    .filter((restaurant) => {
      if (!searchParams.search) return true;
      const searchTerm = searchParams.search.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.description?.toLowerCase().includes(searchTerm) ||
        restaurant.category?.name.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine?.toLowerCase().includes(searchTerm) ||
        restaurant.address?.toLowerCase().includes(searchTerm)
      );
    });

  const collections = await db.query.collections.findMany({
    limit: 3,
  });

  return (
    <Main>
      <div className="relative">
        {/* Hero background image */}
        <div className="absolute inset-0 w-full h-[80vh] z-0">
          <Image
            src="/geneve-hero.png" 
            alt="Vue de Genève"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <Section className="relative z-10 pt-16 pb-24 min-h-[80vh] flex items-center">
          <Container>
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Découvrez les meilleurs restaurants de Genève</span> 
              </h1>
              <p className="mt-4 text-lg text-white/90">
                Explorez notre sélection d'expériences culinaires exceptionnelles, des cafés conviviaux aux restaurants gastronomiques.
              </p>
            </div>
            <div className="mt-8">
              <SearchBar />
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button 
                size="lg" 
                variant="default"
                className="rounded-full px-8 !bg-white !text-black hover:!bg-white/90" 
                asChild
              >
                <Link href="/restaurants">Tous les restaurants</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 border-white text-white hover:bg-white/20" 
                asChild
              >
                <Link href="/collections">Voir les collections</Link>
              </Button>
            </div>
          </Container>
        </Section>
      </div>

      {featuredRestaurants.length > 0 && (
        <Section className="py-8">
          <Container>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Restaurants en vedette</h2>
                <p className="text-muted-foreground mt-2">Nos meilleures sélections de la semaine</p>
              </div>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/restaurants?featured=true">Voir tous</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {collections.length > 0 && (
        <Section className="bg-muted/20 py-8">
          <Container>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Collections populaires</h2>
                <p className="text-muted-foreground mt-2">Listes de restaurants pour chaque occasion</p>
              </div>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/collections">Toutes les collections</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Link 
                  key={collection.id} 
                  href={`/collections/${collection.slug}`}
                  className="relative h-60 overflow-hidden rounded-xl group"
                >
                  {collection.coverImage ? (
                    <Image
                      src={collection.coverImage}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white">{collection.name}</h3>
                    {collection.description && (
                      <p className="text-sm text-white/80 mt-2 line-clamp-2">{collection.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl space-y-8 text-center">
            <h1>
              <Balancer>
                Recevez les dernières nouveautés gastronomiques chaque semaine
              </Balancer>
            </h1>
            <EmailForm />
            <p className="text-sm text-muted-foreground">
              Rejoignez 1,998+ amateurs de gastronomie · Désinscription possible à tout moment
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <Suspense fallback={<div>Chargement des catégories...</div>}>
              <CategoryFilter
                categories={categories.map((cat) => ({
                  id: cat.id.toString(),
                  name: cat.name,
                  color: cat.color || undefined,
                  icon: cat.icon || undefined,
                }))}
              />
            </Suspense>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Aucun restaurant trouvé
                {searchParams.search && ` correspondant à "${searchParams.search}"`}
                {searchParams.category &&
                  ` dans la catégorie "${categories.find((c) => c.id.toString() === searchParams.category)?.name}"`}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
