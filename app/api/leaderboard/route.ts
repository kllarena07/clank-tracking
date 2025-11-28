import { NextResponse } from "next/server";

let leaderboard = [];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    data: leaderboard,
    lastUpdated: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, queries } = body;

    if (!name || typeof queries !== "number") {
      return NextResponse.json(
        {
          error:
            "Invalid request body. Expected { name: string, queries: number }",
        },
        { status: 400 },
      );
    }

    const existingUser = leaderboard.find((user) => user.name === name);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists. Use PATCH to update existing users." },
        { status: 409 },
      );
    }

    leaderboard.push({ name, queries });
    leaderboard.sort((a, b) => b.queries - a.queries);

    return NextResponse.json({
      message: "User created successfully",
      data: leaderboard,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { name, queries } = body;

    if (!name || typeof queries !== "number") {
      return NextResponse.json(
        {
          error:
            "Invalid request body. Expected { name: string, queries: number }",
        },
        { status: 400 },
      );
    }

    const existingUserIndex = leaderboard.findIndex(
      (user) => user.name === name,
    );

    if (existingUserIndex === -1) {
      return NextResponse.json(
        { error: "User not found. Use POST to create new users." },
        { status: 404 },
      );
    }

    leaderboard[existingUserIndex].queries += queries;
    leaderboard.sort((a, b) => b.queries - a.queries);

    return NextResponse.json({
      message: "User updated successfully",
      data: leaderboard,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 },
    );
  }
}
