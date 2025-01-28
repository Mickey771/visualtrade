import { useState, useEffect } from "react";
import { getForexQuotes } from "../utils/polygon-api";

export function useForexData(symbols: string[], interval = 5000) {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const quotes = await getForexQuotes(symbols);
        if (mounted) {
          setData(quotes);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, interval);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [symbols, interval]);

  return { data, loading, error };
}
