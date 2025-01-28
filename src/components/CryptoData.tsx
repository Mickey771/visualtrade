import { useEffect, useState, useRef } from "react";
import { wsClient } from "@/utils/websocket";

interface PriceLevel {
  price: string;
  volume: string;
}

interface CryptoData {
  cmd_id: number;
  data: {
    code: string;
    seq: string;
    tick_time: string;
    bids: PriceLevel[];
    asks: PriceLevel[];
  };
}

export default function CryptoData() {
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 25 crypto pairs including major and trending coins
  const cryptoPairs = [
    // Major coins (15)
    "BTC/USDT",
    "ETH/USDT",
    "BNB/USDT",
    "XRP/USDT",
    "SOL/USDT",
    "ADA/USDT",
    "DOGE/USDT",
    "AVAX/USDT",
    "DOT/USDT",
    "LINK/USDT",
    "MATIC/USDT",
    "SHIB/USDT",
    "LTC/USDT",
    "UNI/USDT",
    "ATOM/USDT",

    // Trending coins (10)
    "PEPE/USDT",
    "ARB/USDT",
    "OP/USDT",
    "APT/USDT",
    "FIL/USDT",
    "NEAR/USDT",
    "ALGO/USDT",
    "XLM/USDT",
    "VET/USDT",
    "RUNE/USDT",
  ];

  useEffect(() => {
    const wsUrl = `wss://quote.tradeswitcher.com/quote-b-ws-api?token=${process.env.NEXT_PUBLIC_ALL_TICK_API_KEY}`;

    wsClient.setHeartbeatCallback(() => {
      timerRef.current = setInterval(() => {
        const heartbeat = {
          cmd_id: 22000,
          seq_id: 123,
          trace: "crypto-heartbeat",
          data: {},
        };
        wsClient.sendMessage(JSON.stringify(heartbeat));
      }, 10000);
    });

    wsClient.connect(wsUrl);

    const ws = wsClient.ws;
    if (ws) {
      const handleMessage = (event: MessageEvent) => {
        const data: CryptoData = JSON.parse(event.data);

        if (data.cmd_id === 22999) {
          setCryptoData((current) => ({
            ...current,
            [data.data.code]: data,
          }));
        }
      };

      const handleError = (error: Event) => {
        setError("Connection error");
        setIsLoading(false);
      };

      const handleOpen = () => {
        setIsLoading(false);
        // Send subscription message
        const subscribeMsg = {
          cmd_id: 22002,
          seq_id: 123,
          trace: "crypto-subscription-001",
          data: {
            symbol_list: cryptoPairs.map((pair) => ({
              code: pair.replace("/", ""),
              depth_level: 1,
            })),
          },
        };
        wsClient.sendMessage(JSON.stringify(subscribeMsg));
      };

      ws.addEventListener("message", handleMessage);
      ws.addEventListener("error", handleError);
      ws.addEventListener("open", handleOpen);

      return () => {
        ws.removeEventListener("message", handleMessage);
        ws.removeEventListener("error", handleError);
        ws.removeEventListener("open", handleOpen);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        wsClient.disconnect();
      };
    }
  }, []);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (isLoading)
    return <div className="p-4 text-gray-600">Loading Crypto Data...</div>;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
      {cryptoPairs.map((pair) => {
        const code = pair.replace("/", "");
        const data = cryptoData[code];
        const bestBid = data?.data?.bids?.[0]?.price || "0";
        const bestAsk = data?.data?.asks?.[0]?.price || "0";
        const bid = parseFloat(bestBid);
        const ask = parseFloat(bestAsk);
        const spread = ask - bid;

        return (
          <div
            key={pair}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-orange-600">
                {pair.split("/")[0]}
                <span className="text-gray-500">/{pair.split("/")[1]}</span>
              </h3>
              {data && (
                <span className="text-xs text-gray-500">
                  {new Date(parseInt(data.data.tick_time)).toLocaleTimeString()}
                </span>
              )}
            </div>

            {data ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Bid:</span>
                  <span className="text-green-600 font-mono">
                    ${bid.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Ask:</span>
                  <span className="text-red-600 font-mono">
                    ${ask.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Spread:</span>
                  <span className="text-purple-600 font-mono">
                    ${spread.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No data available</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
