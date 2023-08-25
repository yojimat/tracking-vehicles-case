import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.nextUrl);
  const text = url.searchParams.get("text");
  const response = await fetch(`http://127.0.0.1:3000/places?text=${text}`, {
    next: {
      revalidate: 60, // seconds
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
