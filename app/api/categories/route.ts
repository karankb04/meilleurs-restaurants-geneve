import { db } from "@/db";
import { categories } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication for development
    // const session = await boho.verifyAuth(request);
    
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    
    const body = await request.json();
    const { name, description, slug, icon, color } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    const normalizedSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    
    // Generate a random ID without nanoid
    const randomId = Math.random().toString(36).substring(2, 15);
    
    const newCategory = await db.insert(categories).values({
      id: randomId, // Use our simple random ID instead of nanoid
      name,
      description: description || null,
      slug: normalizedSlug,
      icon: icon || null,
      color: color || null,
    }).returning();
    
    return NextResponse.json(newCategory[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allCategories = await db.query.categories.findMany({
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    });
    
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 