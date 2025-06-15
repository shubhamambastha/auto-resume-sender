import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export interface JWTPayload {
  email: string;
  exp: number;
  iat: number;
}

// Generate JWT token
export async function generateToken(email: string): Promise<string> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token expires in 24 hours
    .sign(JWT_SECRET);

  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Ensure the payload has the expected structure
    if (
      payload &&
      typeof payload.email === "string" &&
      typeof payload.exp === "number" &&
      typeof payload.iat === "number"
    ) {
      return payload as unknown as JWTPayload;
    }

    return null;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(payload: JWTPayload): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}
