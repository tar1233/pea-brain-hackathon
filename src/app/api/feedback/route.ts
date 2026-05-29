import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pins = await prisma.feedbackPin.findMany({
      orderBy: { timestamp: "asc" }
    });
    return NextResponse.json(pins);
  } catch (error) {
    console.error("Error fetching feedback pins:", error);
    return NextResponse.json({ error: "Failed to fetch feedback pins" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, x, y, role, name, text, timestamp, tabId } = body;
    
    const pin = await prisma.feedbackPin.create({
      data: {
        id,
        x,
        y,
        role,
        name,
        text,
        timestamp,
        tabId
      }
    });
    
    return NextResponse.json(pin);
  } catch (error) {
    console.error("Error creating feedback pin:", error);
    return NextResponse.json({ error: "Failed to create feedback pin" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (id) {
      // Delete single pin
      await prisma.feedbackPin.delete({
        where: { id }
      });
    } else {
      // Delete all pins
      await prisma.feedbackPin.deleteMany({});
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feedback pin(s):", error);
    return NextResponse.json({ error: "Failed to delete feedback pin(s)" }, { status: 500 });
  }
}
