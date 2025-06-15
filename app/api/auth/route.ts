import { NextRequest, NextResponse } from "next/server";

// Hardcoded credentials
const VALID_EMAIL = "admin@example.com";
const VALID_PASSWORD = "password123";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check credentials
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      return NextResponse.json(
        { message: "Login successful", success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
