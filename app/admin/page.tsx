import { getAllRestaurants, getAllCategories } from "@/lib/data";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const categories = await getAllCategories();
  const restaurants = await getAllRestaurants();

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Gérez votre répertoire de restaurants
            </p>
          </div>

          <Tabs defaultValue="restaurants">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="categories">Catégories</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button asChild size="sm">
                  <Link href="/admin/restaurants/new">
                    <span className="flex items-center w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un restaurant
                    </span>
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/categories/new">
                    <span className="flex items-center w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter une catégorie
                    </span>
                  </Link>
                </Button>
              </div>
            </div>

            <TabsContent value="restaurants" className="space-y-4">
              <div className="grid gap-4">
                {restaurants.map((restaurant) => (
                  <Card key={restaurant.id}>
                    <CardHeader className="pb-2">
                      <CardTitle>{restaurant.name}</CardTitle>
                      <CardDescription>
                        {restaurant.category?.name || "Non catégorisé"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {restaurant.description || "Pas de description"}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/restaurants/${restaurant.slug}`}>
                          <span className="w-full text-center">Voir</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/restaurants/${restaurant.id}/edit`}>
                          <span className="w-full text-center">Modifier</span>
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {restaurants.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aucun restaurant trouvé. Ajoutez votre premier restaurant.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/admin/restaurants/new">
                        <span className="flex items-center w-full">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Ajouter un restaurant
                        </span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <CardDescription>{category.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div
                        className="h-2 w-full rounded-full"
                        style={{
                          backgroundColor:
                            category.color || "hsl(var(--primary))",
                        }}
                      />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <span className="w-full text-center">Modifier</span>
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {categories.length === 0 && (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-muted-foreground">
                      Aucune catégorie trouvée. Ajoutez votre première catégorie.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/admin/categories/new">
                        <span className="flex items-center w-full">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Ajouter une catégorie
                        </span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="collections" className="space-y-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  La gestion des collections sera bientôt disponible.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}
