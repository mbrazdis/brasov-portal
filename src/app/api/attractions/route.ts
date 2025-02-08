import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const attractions = await prisma.attraction.findMany();
    return NextResponse.json(attractions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch attractions" }, { status: 500 });
  }
}