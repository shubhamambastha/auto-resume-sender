import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isTokenExpired } from "../../lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required", valid: false },
        { status: 400 }
      );
    }

    // Verify the token
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token", valid: false },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(payload)) {
      return NextResponse.json(
        { error: "Token expired", valid: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Token is valid",
        valid: true,
        user: { email: payload.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", valid: false },
      { status: 500 }
    );
  }
}
