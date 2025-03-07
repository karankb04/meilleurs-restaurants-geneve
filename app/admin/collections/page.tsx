"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Section } from "@/components/craft";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminCollectionsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create collection");
      }

      toast.success("Collection created successfully");
      setName("");
      setDescription("");
      setSlug("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create collection");
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
              <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
              <p className="text-muted-foreground">
                Create and manage collections
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Create Collection</CardTitle>
                <CardDescription>
                  Add a new collection to group resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slug">Slug (optional)</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="auto-generated-if-empty"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Collection"}
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