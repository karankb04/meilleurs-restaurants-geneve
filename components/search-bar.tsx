"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/restaurants?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher des restaurants, cuisines ou plats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 rounded-full bg-white/90 backdrop-blur-sm border-transparent"
          />
        </div>
        <div className="relative md:w-1/3">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Quartier de Genève"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 h-12 rounded-full bg-white/90 backdrop-blur-sm border-transparent"
          />
        </div>
        <Button type="submit" className="h-12 rounded-full px-8 bg-primary">
          Rechercher
        </Button>
      </form>
    </div>
  );
}
