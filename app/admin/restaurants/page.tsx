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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
          url,
          address,
          phone,
          priceRange,
          cuisine,
          openingHours,
          coverImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create restaurant");
      }

      toast.success("Restaurant created successfully");
      setName("");
      setDescription("");
      setSlug("");
      setUrl("");
      setAddress("");
      setPhone("");
      setPriceRange("");
      setCuisine("");
      setOpeningHours("");
      setCoverImage("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create restaurant");
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
              <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
              <p className="text-muted-foreground">
                Add and manage restaurant listings
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Add Restaurant</CardTitle>
                <CardDescription>
                  Create a new restaurant listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
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
                      rows={3}
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
                  
                  <div className="grid gap-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$ (Inexpensive)</SelectItem>
                        <SelectItem value="$$">$$ (Moderate)</SelectItem>
                        <SelectItem value="$$$">$$$ (Expensive)</SelectItem>
                        <SelectItem value="$$$$">$$$$ (Very Expensive)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="cuisine">Cuisine</Label>
                    <Input
                      id="cuisine"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      placeholder="Italian, Mexican, etc."
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="openingHours">Opening Hours</Label>
                    <Textarea
                      id="openingHours"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="Mon-Fri: 9am-10pm&#10;Sat-Sun: 10am-11pm"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Restaurant"}
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