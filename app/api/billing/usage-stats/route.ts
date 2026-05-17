import { NextResponse } from "next/server";
import { getUsageStats } from "@/lib/actions/usage";

export async function GET() {
  const stats = await getUsageStats();

  if (!stats) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ stats });
}
