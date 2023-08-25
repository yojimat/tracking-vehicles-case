import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.nextUrl);
  const originId = url.searchParams.get("originId");
  const destinationId = url.searchParams.get("destinationId");
  const response = await fetch(
    `http://127.0.0.1:3000/directions?originId=${originId}&destinationId=${destinationId}`,
    {
      next: {
        revalidate: 60, 
      },
    }
  );
  const data = await response.json();
  return NextResponse.json(data);
}
