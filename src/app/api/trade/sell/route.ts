// File: app/api/trade/sell/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Get token from HTTP-only cookie using updated pattern
    const cookiesList = await cookies();
    const token = cookiesList.get("auth_token")?.value;

    // If no token is found, return unauthorized
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Forward the request to the external API with the token
    const response = await fetch(
      "https://trade-backend-production-3684.up.railway.app/account/trade/sell/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    // Get the response data
    const data = await response.json();

    // Check if token is expired or invalid
    if (response.status === 401 || response.status === 403) {
      // Create response with the appropriate status
      const authErrorResponse = NextResponse.json(
        {
          success: false,
          message: "Authentication expired. Please log in again.",
        },
        { status: 401 }
      );

      // Clear the token by setting it with maxAge 0
      authErrorResponse.cookies.set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
        sameSite: "strict",
      });

      return authErrorResponse;
    }

    // If the external API returns an error
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to place sell order",
        },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      message: "Sell order placed successfully",
      data,
    });
  } catch (error) {
    console.error("Error processing sell request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
