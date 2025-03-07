import { MetadataRoute } from "next";
import { getAllRestaurants } from "@/lib/data";
import { directory } from "@/directory.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const restaurants = await getAllRestaurants();

  const restaurantEntries = restaurants.map((restaurant) => ({
    url: `${directory.baseUrl}/${restaurant.slug}`,
    lastModified: new Date(restaurant.updatedAt || restaurant.createdAt),
  }));

  return [
    {
      url: directory.baseUrl,
      lastModified: new Date(),
    },
    ...restaurantEntries,
  ];
}
