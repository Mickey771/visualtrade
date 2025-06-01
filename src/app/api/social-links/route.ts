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
      `${process.env.NEXT_PUBLIC_BASE_URL}/account/requests/links/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Get the response data
    const data = await response.json();

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
