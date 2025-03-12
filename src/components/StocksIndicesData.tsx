import { useEffect, useState, useRef } from "react";
import { WebSocketClient, wsClient } from "@/utils/websocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import {
  setSelectedPair,
  setSelectedPairPrice,
} from "@/redux/reducers/tradeReducer";

interface PriceLevel {
  price: string;
  volume: string;
}

interface MarketData {
  cmd_id: number;
  data: {
    code: string;
    seq: string;
    tick_time: string;
    bids: PriceLevel[];
    asks: PriceLevel[];
  };
}

export default function MarketsData() {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { selectedPair } = useSelector((store: RootState) => store.trade);

  const dispatch = useDispatch();

  // WebSocket URLs
  const stockWsUrl = `wss://quote.tradeswitcher.com/quote-stock-b-ws-api?token=${process.env.NEXT_PUBLIC_ALL_TICK_API_KEY}`;
  const indexWsUrl = `wss://quote.tradeswitcher.com/quote-b-ws-api?token=${process.env.NEXT_PUBLIC_ALL_TICK_API_KEY}`; // Replace with actual indices URL

  // Combined list of stocks and indices
  const markets = [
    // Stocks
    "AAPL.US",
    "MSFT.US",
    "GOOGL.US",
    "AMZN.US",
    "META.US",
    "TSLA.US",
    "NVDA.US",
    "INTC.US",
    "ADBE.US",
    "TSM.US",

    // Indices
    "NAS100",
    "FRA40",
    "GER30",
    "US500",
    "US30",
    "UK100",
    "TWRIC",
    "JPN225",
  ];

  // Display names mapping
  const marketNames: { [key: string]: string } = {
    // Stocks
    "AAPL.US": "Apple",
    "MSFT.US": "Microsoft",
    "GOOGL.US": "Alphabet",
    "AMZN.US": "Amazon",
    "TSLA.US": "Tesla",
    "NVDA.US": "Nvidia",
    "INTC.US": "Intel",
    "ADBE.US": "Adobe",
    "TSM.US": "Taiwan",

    // Indices
    NAS100: "Nasdaq 100",
    FRA40: "CAC 40",
    GER30: "DAX",
    US500: "S&P 500",
    US30: "Dow Jones",
    UK100: "FTSE 100",
    TWRIC: "Taiwan RIC",
    JPN225: "Nikkei 225",
  };

  useEffect(() => {
    const stockClient = new WebSocketClient();
    const indexClient = new WebSocketClient();

    // Heartbeat for stocks
    stockClient.setHeartbeatCallback(() => {
      timerRef.current = setInterval(() => {
        const heartbeat = {
          cmd_id: 22000,
          seq_id: 123,
          trace: "stock-heartbeat",
          data: {},
        };
        stockClient.sendMessage(JSON.stringify(heartbeat));
      }, 10000);
    });

    // Heartbeat for indices
    indexClient.setHeartbeatCallback(() => {
      timerRef.current = setInterval(() => {
        const heartbeat = {
          cmd_id: 22000,
          seq_id: 123,
          trace: "index-heartbeat",
          data: {},
        };
        indexClient.sendMessage(JSON.stringify(heartbeat));
      }, 10000);
    });

    // Connect to stock WebSocket
    stockClient.connect(stockWsUrl);
    const stockWs = stockClient.ws;

    // Connect to index WebSocket
    indexClient.connect(indexWsUrl);
    const indexWs = indexClient.ws;

    const handleMessage = (event: MessageEvent) => {
      const data: MarketData = JSON.parse(event.data);

      if (data.cmd_id === 22999) {
        setMarketData((current) => ({
          ...current,
          [data.data.code]: data,
        }));

        if (data.data.code === selectedPair) {
          const selectedPairBid = data.data?.bids?.[0]?.price || "0";
          const selectedPairAsk = data.data?.asks?.[0]?.price || "0";
          const bid = parseFloat(selectedPairBid);
          const ask = parseFloat(selectedPairAsk);
          dispatch(setSelectedPairPrice({ bid, ask }));
        }
      }
    };

    const handleError = (error: Event) => {
      setError("Connection error");
      setIsLoading(false);
    };

    if (stockWs && indexWs) {
      const handleStockOpen = () => {
        // Subscribe to stocks
        const stockSubscribeMsg = {
          cmd_id: 22002,
          seq_id: 123,
          trace: "stock-subscription-001",
          data: {
            symbol_list: markets
              .filter((code) => code.includes("."))
              .map((code) => ({
                code: code,
                depth_level: 5,
              })),
          },
        };
        stockClient.sendMessage(JSON.stringify(stockSubscribeMsg));
      };

      const handleIndexOpen = () => {
        // Subscribe to indices
        const indexSubscribeMsg = {
          cmd_id: 22002,
          seq_id: 123,
          trace: "index-subscription-001",
          data: {
            symbol_list: markets
              .filter((code) => !code.includes("."))
              .map((code) => ({
                code: code,
                depth_level: 1,
              })),
          },
        };
        indexClient.sendMessage(JSON.stringify(indexSubscribeMsg));

        // Only set loading to false after both connections are open
        setIsLoading(false);
      };

      stockWs.addEventListener("message", handleMessage);
      stockWs.addEventListener("error", handleError);
      stockWs.addEventListener("open", handleStockOpen);

      indexWs.addEventListener("message", handleMessage);
      indexWs.addEventListener("error", handleError);
      indexWs.addEventListener("open", handleIndexOpen);

      return () => {
        stockWs.removeEventListener("message", handleMessage);
        stockWs.removeEventListener("error", handleError);
        stockWs.removeEventListener("open", handleStockOpen);

        indexWs.removeEventListener("message", handleMessage);
        indexWs.removeEventListener("error", handleError);
        indexWs.removeEventListener("open", handleIndexOpen);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        stockClient.disconnect();
        indexClient.disconnect();
      };
    }
  }, []);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (isLoading)
    return <div className="p-4 text-[#ffffff9e]">Loading Market Data...</div>;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
      {markets.map((code) => {
        const data = marketData[code];
        const bestBid = data?.data?.bids?.[0]?.price || "0";
        const bestAsk = data?.data?.asks?.[0]?.price || "0";
        const bid = parseFloat(bestBid);
        const ask = parseFloat(bestAsk);
        const spread = ask - bid;
        const isIndex = !code.includes(".");

        return (
          <div
            key={code}
            onClick={() => dispatch(setSelectedPair(code))}
            className={`border rounded-lg p-4  shadow-sm hover:shadow-md transition-shadow ${
              isIndex ? "border-indigo-100" : "border-blue-100"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                <span
                  className={isIndex ? "text-[#ffffff9e]" : "text-blue-500"}
                >
                  {marketNames[code]}
                </span>
                <span className="text-[#ffffff9e]"> ({code})</span>
              </h3>
              {data && (
                <span className="text-xs text-[#ffffff9e]">
                  {new Date(parseInt(data.data.tick_time)).toLocaleTimeString()}
                </span>
              )}
            </div>

            {data ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#ffffff9e]">Best Bid:</span>
                  <span className="text-green-500 font-mono">
                    {isIndex ? bid.toFixed(2) : `$${bid.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ffffff9e]">Best Ask:</span>
                  <span className="text-red-500 font-mono">
                    {isIndex ? ask.toFixed(2) : `$${ask.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-[#ffffff9e]">Spread:</span>
                  <span className="text-purple-500 font-mono">
                    {spread.toFixed(2)}
                  </span>
                </div>

                {!isIndex && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <p className="text-sm font-medium text-[#ffffff9e]">
                        Bids
                      </p>
                      {data.data.bids.slice(0, 3).map((bid, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs"
                        >
                          <span>${parseFloat(bid.price).toFixed(2)}</span>
                          <span className="text-[#ffffff9e]">
                            {parseFloat(bid.volume).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#ffffff9e]">
                        Asks
                      </p>
                      {data.data.asks.slice(0, 3).map((ask, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs"
                        >
                          <span>${parseFloat(ask.price).toFixed(2)}</span>
                          <span className="text-[#ffffff9e]">
                            {parseFloat(ask.volume).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
