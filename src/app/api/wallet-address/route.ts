// app/api/wallet-address/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Get token from HTTP-only cookie
    const cookiesList = await cookies();
    const token = cookiesList.get("auth_token")?.value;

    // If no token is found, return unauthorized
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward the request to the external API with the token
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/account/requests/admin_address/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
          message: data.message || "Failed to fetch wallet addresses",
        },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching wallet addresses:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
