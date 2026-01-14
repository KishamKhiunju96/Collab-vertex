import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { message: "Brand name is required" },
        { status: 400 },
      );
    }

    const brand = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date(),
    };

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
