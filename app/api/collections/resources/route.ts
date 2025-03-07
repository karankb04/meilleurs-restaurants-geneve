import { db } from "@/db";
import { resources, collectionResources } from "@/db/schema";
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
    const { resourceId, collectionId } = body;
    
    if (!resourceId || !collectionId) {
      return NextResponse.json(
        { error: "Resource ID and Collection ID are required" },
        { status: 400 }
      );
    }
    
    const result = await db.insert(collectionResources).values({
      resourceId,
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