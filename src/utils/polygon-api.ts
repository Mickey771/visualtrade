import axios from "axios";

const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const BASE_URL = "https://api.polygon.io/v2";

interface ForexQuote {
  ticker: string;
  ask: number;
  bid: number;
  last: {
    price: number;
    timestamp: number;
  };
  // Add other fields you need
}

export async function getForexQuote(symbol: string): Promise<ForexQuote> {
  const response = await axios.get(`${BASE_URL}/last/trade/${symbol}`, {
    params: {
      apiKey: POLYGON_API_KEY,
    },
  });
  return response.data.results;
}

export async function getForexQuotes(
  symbols: string[]
): Promise<Record<string, ForexQuote>> {
  const quotes = await Promise.all(
    symbols.map((symbol) => getForexQuote(symbol))
  );

  return quotes.reduce((acc, quote) => {
    acc[quote.ticker] = quote;
    return acc;
  }, {} as Record<string, ForexQuote>);
}
