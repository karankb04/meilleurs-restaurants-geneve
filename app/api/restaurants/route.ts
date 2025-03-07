import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { boho } from "@/lib/boho";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication for development
    // const session = await boho.verifyAuth(request);
    
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    
    const body = await request.json();
    const { 
      name, 
      description, 
      slug, 
      url, 
      address, 
      phone, 
      priceRange, 
      cuisine, 
      openingHours, 
      coverImage 
    } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    const normalizedSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    
    const newRestaurant = await db.insert(restaurants).values({
      name,
      description,
      slug: normalizedSlug,
      url,
      address,
      phone,
      priceRange,
      cuisine,
      openingHours,
      coverImage,
    }).returning();
    
    return NextResponse.json(newRestaurant[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    
    let query = db.query.restaurants;
    
    if (featured === 'true') {
      const featuredRestaurants = await query.findMany({
        where: (restaurants, { eq }) => eq(restaurants.isFeatured, 1),
        with: {
          category: true,
        },
      });
      
      return NextResponse.json(featuredRestaurants);
    }
    
    const allRestaurants = await query.findMany({
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