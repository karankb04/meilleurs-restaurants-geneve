import { db } from "@/db";
import { categories } from "@/db/schema";
import { boho } from "@/lib/boho";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily bypass authentication for development
    // const session = await boho.verifyAuth(request);
    
    // Commenting out the session check for now
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    
    const { id } = params;
    const body = await request.json();
    const { name, description, slug, icon, color } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    const normalizedSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    
    const updatedCategory = await db.update(categories)
      .set({
        name,
        description: description || null,
        slug: normalizedSlug,
        icon: icon || null,
        color: color || null,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(categories.id, id))
      .returning();
    
    if (updatedCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily bypass authentication for development
    // const session = await boho.verifyAuth(request);
    
    // Commenting out the session check for now
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    
    const { id } = params;
    
    const deletedCategory = await db.delete(categories)
      .where(eq(categories.id, id))
      .returning();
    
    if (deletedCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(deletedCategory[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 