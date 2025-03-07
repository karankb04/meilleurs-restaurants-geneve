import { db } from "@/db";
import { categories } from "@/db/schema";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication
    console.log("Processing category creation request");
    
    const body = await request.json();
    const { name, description, slug, icon, color } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    const normalizedSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    
    console.log("Creating category with data:", {
      name,
      description,
      slug: normalizedSlug,
      icon,
      color
    });
    
    const newCategory = await db.insert(categories).values({
      id: nanoid(),
      name,
      description: description || null,
      slug: normalizedSlug,
      icon: icon || null,
      color: color || null,
    }).returning();
    
    console.log("Category created successfully:", newCategory[0]);
    return NextResponse.json(newCategory[0]);
  } catch (error) {
    console.error("Error in POST /api/categories:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
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