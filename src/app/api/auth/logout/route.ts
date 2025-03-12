// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the auth token cookie on the response object
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
    sameSite: "strict",
  });

  return response;
}
