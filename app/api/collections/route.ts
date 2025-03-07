import { db } from "@/db";
import { collections } from "@/db/schema";
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
    const { name, description, slug } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    const normalizedSlug = slug || name.toLowerCase().replace(/\s+/g, "-");
    
    const newCollection = await db.insert(collections).values({
      name,
      description: description || null,
      slug: normalizedSlug,
    }).returning();
    
    return NextResponse.json(newCollection[0]);
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
    const allCollections = await db.query.collections.findMany({
      orderBy: (collections, { desc }) => [desc(collections.createdAt)],
    });
    
    return NextResponse.json(allCollections);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 