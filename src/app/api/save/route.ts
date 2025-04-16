import { prisma } from "@/lib/prisma"; // seu client do Prisma
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { documentId, messages } = body;

  if (!documentId || !messages) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const history = await prisma.history.create({
      data: {
        documentId,
        messages: JSON.stringify(messages),
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
  }
}