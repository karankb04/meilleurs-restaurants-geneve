import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/category-form";

export const metadata = {
  title: "Ajouter une catégorie | GastroGenève",
};

export default async function NewCategoryPage() {
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
            <h1 className="text-3xl font-bold">Ajouter une catégorie</h1>
            <p className="text-muted-foreground">
              Créez une nouvelle catégorie pour vos restaurants
            </p>
          </div>
          
          <Card className="p-6">
            <CategoryForm />
          </Card>
        </div>
      </Container>
    </Section>
  );
} 