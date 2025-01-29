import { useEffect, useState, useRef } from "react";
import { wsClient } from "@/utils/websocket";

interface PriceLevel {
  price: string;
  volume: string;
}

interface IndexData {
  cmd_id: number;
  data: {
    code: string;
    seq: string;
    tick_time: string;
    bids: PriceLevel[];
    asks: PriceLevel[];
  };
}

export default function IndicesData() {
  const [indexData, setIndexData] = useState<Record<string, IndexData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Major global indices
  const indices = [
    "NAS100", // Nasdaq 100
    "FRA40", // CAC 40
    "GER30", // DAX
    "US500", // S&P 500
    "US30", // Dow Jones
    "UK100", // FTSE 100
    "HK50", // Hang Seng
    "JPN225", // Nikkei 225
  ];

  // Full names for display
  const indexNames: { [key: string]: string } = {
    NAS100: "Nasdaq 100",
    FRA40: "CAC 40",
    GER30: "DAX",
    US500: "S&P 500",
    US30: "Dow Jones",
    UK100: "FTSE 100",
    HK50: "Hang Seng",
    JPN225: "Nikkei 225",
  };

  useEffect(() => {
    const wsUrl = `wss://quote.tradeswitcher.com/quote-b-ws-api?token=7f07d4c7a2120ed91466326472d73e08-c-app`;

    wsClient.setHeartbeatCallback(() => {
      timerRef.current = setInterval(() => {
        const heartbeat = {
          cmd_id: 22000,
          seq_id: 123,
          trace: "indices-heartbeat",
          data: {},
        };
        wsClient.sendMessage(JSON.stringify(heartbeat));
      }, 10000);
    });

    wsClient.connect(wsUrl);

    const ws = wsClient.ws;
    if (ws) {
      const handleMessage = (event: MessageEvent) => {
        const data: IndexData = JSON.parse(event.data);

        if (data.cmd_id === 22999) {
          setIndexData((current) => ({
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
          trace: "indices-subscription-001",
          data: {
            symbol_list: indices.map((code) => ({
              code: code,
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
    return <div className="p-4 text-gray-600">Loading Indices Data...</div>;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {indices.map((code) => {
        const data = indexData[code];
        const bestBid = data?.data?.bids?.[0]?.price || "0";
        const bestAsk = data?.data?.asks?.[0]?.price || "0";
        const bid = parseFloat(bestBid);
        const ask = parseFloat(bestAsk);
        const spread = ask - bid;

        return (
          <div
            key={code}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-indigo-600">
                {indexNames[code]}
                <span className="text-gray-500"> ({code})</span>
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
                    {bid.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Ask:</span>
                  <span className="text-red-600 font-mono">
                    {ask.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Spread:</span>
                  <span className="text-purple-600 font-mono">
                    {spread.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bids</p>
                    {data.data.bids.slice(0, 2).map((bid, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{parseFloat(bid.price).toFixed(2)}</span>
                        <span className="text-gray-500">
                          {parseFloat(bid.volume).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Asks</p>
                    {data.data.asks.slice(0, 2).map((ask, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{parseFloat(ask.price).toFixed(2)}</span>
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
