import { Container, Section } from "@/components/craft";
import { db } from "@/db";
import { collections } from "@/db/schema";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CollectionsPage() {
  const allCollections = await db.query.collections.findMany({
    orderBy: (collections, { desc }) => [desc(collections.createdAt)],
  });

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
              <p className="text-muted-foreground">
                Browse resources by collection
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allCollections.map((collection) => (
                <Link 
                  key={collection.id} 
                  href={`/collections/${collection.slug}`}
                  className="transition-all hover:opacity-80"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{collection.name}</CardTitle>
                      <CardDescription>
                        {collection.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        View collection →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
} 