import { NextResponse } from "next/server";
import {
  cashflowPoints,
  dashboardSummary,
  topCategories,
} from "@/lib/dashboard-data";

export async function GET() {
  return NextResponse.json({
    summary: dashboardSummary,
    cashflowPoints,
    topCategories,
    lastUpdated: new Date().toISOString(),
  });
}
