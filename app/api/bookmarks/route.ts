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

    // Insert the new bookmark
    await db.insert(restaurants).values({
      url: body.url,
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      categoryId: body.categoryId || null,
      overview: body.overview || null,
      favicon: body.favicon || null,
      screenshot: body.screenshot || null,
      ogImage: body.ogImage || null,
      ogTitle: body.ogTitle || null,
      ogDescription: body.ogDescription || null,
      notes: body.notes || null,
      tags: body.tags || null,
      isArchived: body.isArchived || false,
      isFavorite: body.isFavorite || false,
      search_results: body.search_results || null,
    });

    return NextResponse.json(
      { message: "Bookmark created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 },
    );
  }
}
