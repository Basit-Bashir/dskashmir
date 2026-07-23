import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.HP_BACKEND_URL || "https://api.dskashmir.com";

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { path } = await params;
  const res = await fetch(`${BACKEND}/hp/${path.join("/")}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { path } = await params;
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${BACKEND}/hp/${path.join("/")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}