import { useEffect, useState, useRef } from "react";
import { wsClient } from "@/utils/websocket";

interface PriceLevel {
  price: string;
  volume: string;
}

interface StockData {
  cmd_id: number;
  data: {
    code: string;
    seq: string;
    tick_time: string;
    bids: PriceLevel[];
    asks: PriceLevel[];
  };
}

export default function StockData() {
  const [stockData, setStockData] = useState<Record<string, StockData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 25 major stocks from different markets
  const stocks = [
    // US Tech
    "AAPL.US",
    "MSFT.US",
    "GOOGL.US",
    "AMZN.US",
    "META.US",
    "TSLA.US",
    "NVDA.US",
    "INTC.US",
    "ADBE.US",
    "CSCO.US",

    // US Other
    "JPM.US",
    "V.US",
    "WMT.US",
    "JNJ.US",
    "PG.US",

    // Hong Kong
    "700.HK",
    "9988.HK",
    "3690.HK",
    "1211.HK",
    "1810.HK",

    // china
    "000001.SH",
    "399001.SZ",
    "399006.SZ",
    "600941.SH",
    "600519.SH",
  ];

  useEffect(() => {
    const wsUrl = `wss://quote.tradeswitcher.com/quote-stock-b-ws-api?token=${process.env.NEXT_PUBLIC_ALL_TICK_API_KEY}`;

    wsClient.setHeartbeatCallback(() => {
      timerRef.current = setInterval(() => {
        const heartbeat = {
          cmd_id: 22000,
          seq_id: 123,
          trace: "stock-heartbeat",
          data: {},
        };
        wsClient.sendMessage(JSON.stringify(heartbeat));
      }, 10000);
    });

    wsClient.connect(wsUrl);

    const ws = wsClient.ws;
    if (ws) {
      const handleMessage = (event: MessageEvent) => {
        const data: StockData = JSON.parse(event.data);

        if (data.cmd_id === 22999) {
          setStockData((current) => ({
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
          trace: "stock-subscription-001",
          data: {
            symbol_list: stocks.map((stock) => ({
              code: stock,
              depth_level: 5,
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
    return <div className="p-4 text-gray-600">Loading Stock Data...</div>;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
      {stocks.map((stockCode) => {
        const data = stockData[stockCode];
        const bestBid = data?.data?.bids?.[0]?.price || "0";
        const bestAsk = data?.data?.asks?.[0]?.price || "0";
        const bid = parseFloat(bestBid);
        const ask = parseFloat(bestAsk);
        const spread = ask - bid;

        return (
          <div
            key={stockCode}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-600">
                {stockCode.split(".")[0]}
                <span className="text-gray-500">
                  {" "}
                  ({stockCode.split(".")[1]})
                </span>
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

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Top Bids
                    </p>
                    {data.data.bids.slice(0, 3).map((bid, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>${parseFloat(bid.price).toFixed(2)}</span>
                        <span className="text-gray-500">
                          {parseFloat(bid.volume).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Top Asks
                    </p>
                    {data.data.asks.slice(0, 3).map((ask, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>${parseFloat(ask.price).toFixed(2)}</span>
                        <span className="text-gray-500">
                          {parseFloat(ask.volume).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
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
