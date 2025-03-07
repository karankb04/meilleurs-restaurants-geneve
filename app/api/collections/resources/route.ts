import { db } from "@/db";
import { bookmarkCollections } from "@/db/schema";
import { boho } from "@/lib/boho";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await boho.verifyAuth(request);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { bookmarkId, collectionId } = body;
    
    if (!bookmarkId || !collectionId) {
      return NextResponse.json(
        { error: "Bookmark ID and Collection ID are required" },
        { status: 400 }
      );
    }
    
    const result = await db.insert(bookmarkCollections).values({
      bookmarkId,
      collectionId,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 