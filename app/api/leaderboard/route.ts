import { NextResponse } from "next/server";

const leaderboard = [
  { rank: 1, name: "Alice Chen", queries: 15420 },
  { rank: 2, name: "Bob Smith", queries: 12850 },
  { rank: 3, name: "Charlie Davis", queries: 11200 },
  { rank: 4, name: "Diana Wilson", queries: 9875 },
  { rank: 5, name: "Ethan Brown", queries: 8650 },
  { rank: 6, name: "Fiona Martinez", queries: 7420 },
  { rank: 7, name: "George Taylor", queries: 6300 },
  { rank: 8, name: "Hannah Lee", queries: 5180 },
  { rank: 9, name: "Ian Johnson", queries: 4250 },
  { rank: 10, name: "Julia Garcia", queries: 3500 },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    data: leaderboard,
    lastUpdated: new Date().toISOString(),
  });
}
