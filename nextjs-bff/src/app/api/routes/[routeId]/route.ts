import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { routeId } }: { params: { routeId: string } }
) {
  const response = await fetch(`http://127.0.0.1:3000/routes/${routeId}`, {
    next: {
      revalidate: 60, // seconds
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
