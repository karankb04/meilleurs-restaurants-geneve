import { getCategoryById } from "@/lib/data";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/category-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Modifier une catégorie | GastroGenève",
};

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategoryById(params.id);

  if (!category) {
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
            <h1 className="text-3xl font-bold">Modifier une catégorie</h1>
            <p className="text-muted-foreground">
              Modifiez les informations de la catégorie
            </p>
          </div>
          
          <Card className="p-6">
            <CategoryForm category={category} />
          </Card>
        </div>
      </Container>
    </Section>
  );
} 