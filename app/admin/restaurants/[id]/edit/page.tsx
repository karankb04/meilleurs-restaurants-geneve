import { getRestaurantById, getAllCategories } from "@/lib/data";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RestaurantForm } from "@/components/restaurant-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Modifier un restaurant | GastroGenève",
};

export default async function EditRestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const [restaurant, categories] = await Promise.all([
    getRestaurantById(parseInt(params.id)),
    getAllCategories(),
  ]);

  if (!restaurant) {
    notFound();
  }

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <Button asChild variant="ghost" size="sm" className="mb-2">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au tableau de bord
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Modifier un restaurant</h1>
            <p className="text-muted-foreground">
              Modifiez les informations du restaurant
            </p>
          </div>
          
          <Card className="p-6">
            <RestaurantForm categories={categories} restaurant={restaurant} />
          </Card>
        </div>
      </Container>
    </Section>
  );
} 