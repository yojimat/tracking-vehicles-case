import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = await fetch(`http://127.0.0.1:3000/routes/`, {
    next: {
      tags: ["routes"], // Cache revalidation by demand
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const response = await fetch(`http://127.0.0.1:3000/routes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
  })
  revalidateTag('routes')
  const data = await response.json();
  return NextResponse.json(data);
}