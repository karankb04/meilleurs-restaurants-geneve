import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { boho } from "@/lib/boho";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allRestaurants = await db.query.restaurants.findMany({
      orderBy: (restaurants, { desc }) => [desc(restaurants.createdAt)],
      with: {
        category: true,
      },
    });
    
    return NextResponse.json(allRestaurants);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Insert the new restaurant
    await db.insert(restaurants).values({
      name: body.title || body.name,
      slug: body.slug,
      description: body.description || null,
      url: body.url || null,
      categoryId: body.categoryId || null,
      address: body.address || null,
      phone: body.phone || null,
      priceRange: body.priceRange || null,
      cuisine: body.cuisine || null,
      openingHours: body.openingHours || null,
      coverImage: body.coverImage || body.ogImage || null,
      favicon: body.favicon || null,
      isArchived: body.isArchived || false,
      isFeatured: body.isFeatured || false,
      notes: body.notes || null,
    });

    return NextResponse.json(
      { message: "Restaurant created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 },
    );
  }
}
