"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  slug: z.string().optional(),
});

export function CategoryForm({ category }: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Generate a slug from the name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: "",
      description: "",
      icon: "",
      color: "#4f46e5",
      slug: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Make sure we have a slug
      if (!values.slug) {
        values.slug = generateSlug(values.name);
      }
      
      // Prepare the payload with proper defaults for all fields
      const payload = {
        name: values.name,
        description: values.description || "",
        slug: values.slug,
        icon: values.icon || "",
        color: values.color || "#4f46e5",
      };
      
      console.log("Submitting category:", payload);
      
      // Make the API call
      const response = await fetch(
        category ? `/api/categories/${category.id}` : "/api/categories", 
        {
          method: category ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to save category");
      }
      
      const result = await response.json();
      console.log("Success response:", result);
      
      toast.success(category ? "Catégorie mise à jour" : "Catégorie créée");
      router.push("/admin");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Erreur lors de la sauvegarde de la catégorie");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la catégorie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input 
                  placeholder="nom-de-la-categorie" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value || generateSlug(form.getValues("name")));
                  }}
                />
              </FormControl>
              <FormDescription>
                Identifiant unique utilisé dans l'URL (généré automatiquement si vide)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de la catégorie"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icône</FormLabel>
                <FormControl>
                  <Input placeholder="🍕" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Utilisez un emoji ou un caractère Unicode
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Couleur</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      {...field}
                      value={field.value || "#4f46e5"}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      {...field}
                      value={field.value || "#4f46e5"}
                      className="flex-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : category ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 