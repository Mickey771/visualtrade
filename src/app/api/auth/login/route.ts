// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward login request to the main API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/account/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    // If login fails, return the error
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.data?.message || "Login failed" },
        { status: response.status }
      );
    }

    // Extract token from response
    const token = data.data?.access;

    if (token) {
      // Create response to return
      const response = NextResponse.json({
        success: true,
        data: {
          ...data.data,
          // Don't send token back in response body for added security
          access: undefined,
        },
      });

      // Set the cookie on the response object directly
      response.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        sameSite: "strict",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid authentication response" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
