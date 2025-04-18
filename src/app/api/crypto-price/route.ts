// app/api/crypto-price/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get code from query params
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code") || "BTCUSDT";

    // Get API token from environment variables
    const token = process.env.NEXT_PUBLIC_ALL_TICK_API_KEY;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "API token not configured" },
        { status: 500 }
      );
    }

    // Create unique trace ID
    const traceId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    // Prepare request payload
    const payload = {
      data: {
        code: code,
        kline_type: "8", // Default value from example
        kline_timestamp_end: "0",
        query_kline_num: "1",
        adjust_type: "0",
      },
      trace: traceId,
    };

    // Call external API to get crypto price
    const response = await fetch(
      `https://quote.alltick.io/quote-b-api/kline?token=${token}&query={"data":{"code":"${code}","kline_type":"8","kline_timestamp_end":"0","query_kline_num":"1","adjust_type":"0"},"trace":"5bf1a99f-ac23-42e1-83d2-8aa078b3a04d"}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Get response data
    const data = await response.json();

    // Return response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching crypto price:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
