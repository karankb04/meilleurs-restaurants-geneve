import { getAllCategories } from "@/lib/data";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Catégories | GastroGenève",
  description: "Parcourez les restaurants par catégorie",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <Main>
      <Section>
        <Container>
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catégories</h1>
              <p className="text-muted-foreground">Parcourez les restaurants par catégorie</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
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
                      style={{ backgroundColor: category.color || "hsl(var(--primary))" }}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="ghost" className="w-full justify-between">
                      <Link href={`/?category=${category.id}`}>
                        <span>Voir les restaurants</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Aucune catégorie trouvée</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </Main>
  );
} 