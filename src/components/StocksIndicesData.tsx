import React, { useEffect, useState, useRef } from "react";
import { WebSocketClient, wsClient } from "@/utils/websocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import {
  setChartSymbol,
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
  const stockClientRef = useRef<WebSocketClient | null>(null);
  const indexClientRef = useRef<WebSocketClient | null>(null);
  const reconnectingRef = useRef<boolean>(false);

  // Local state to track connection status for UI purposes
  const [connectionStatus, setConnectionStatus] = useState("loading");
  // Force the component to re-render when an error occurs or clears
  const [forceUpdate, setForceUpdate] = useState(0);

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
    "XETR",
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
    "META.US": "Meta",
    "TSLA.US": "Tesla",
    "NVDA.US": "Nvidia",
    "INTC.US": "Intel",
    "ADBE.US": "Adobe",
    "TSM.US": "Taiwan",

    // Indices
    NAS100: "Nasdaq 100",
    FRA40: "CAC 40",
    XETR: "DAX",
    US500: "S&P 500",
    US30: "Dow Jones",
    UK100: "FTSE 100",
    TWRIC: "Taiwan RIC",
    JPN225: "Nikkei 225",
  };

  // Display names mapping
  const chartNames: { [key: string]: string } = {
    // Stocks
    "AAPL.US": "NASDAQ:AAPL",
    "MSFT.US": "NASDAQ:MSFT",
    "GOOGL.US": "NASDAQ:GOOGL",
    "AMZN.US": "NASDAQ:AMZN",
    "META.US": "NASDAQ:META",
    "TSLA.US": "NASDAQ:TSLA",
    "NVDA.US": "NASDAQ:NVDA",
    "INTC.US": "NASDAQ:INTC",
    "ADBE.US": "NASDAQ:ADBE",
    "TSM.US": "NYSE:TSM",

    // Indices
    NAS100: "PEPPERSTONE:NAS100",
    FRA40: "FOREXCOM:FRA40",
    XETR: "XETR:DAX",
    US500: "CAPITALCOM:US500",
    US30: "BLACKBULL:US30",
    UK100: "CAPITALCOM:UK100",
    TWRIC: "SPARKS:TAIWANX",
    JPN225: "PEPPERSTONE:JPN225",
  };

  // Listen for the reconnection events
  useEffect(() => {
    const handleReconnected = () => {
      console.log("Reconnection detected in MarketsData");
      setError(null);
      setForceUpdate((prev) => prev + 1); // Force re-render
      setConnectionStatus("connected");
    };

    window.addEventListener("websocket_reconnected", handleReconnected);
    return () => {
      window.removeEventListener("websocket_reconnected", handleReconnected);
    };
  }, []);

  // Update connection status based on hook state
  useEffect(() => {
    if (error) {
      setConnectionStatus("reconnecting");
    } else if (isLoading) {
      setConnectionStatus("loading");
    } else {
      setConnectionStatus("connected");
    }
  }, [error, isLoading, forceUpdate]);

  // Clean up function for WebSocket connections and timers
  const cleanupWebSocketResources = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (stockClientRef.current) {
      stockClientRef.current.disconnect();
    }

    if (indexClientRef.current) {
      indexClientRef.current.disconnect();
    }
  };

  useEffect(() => {
    // Create new WebSocket clients if they don't exist
    if (!stockClientRef.current) {
      stockClientRef.current = new WebSocketClient();
    }

    if (!indexClientRef.current) {
      indexClientRef.current = new WebSocketClient();
    }

    const stockClient = stockClientRef.current;
    const indexClient = indexClientRef.current;

    // Clear any existing heartbeat timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Heartbeat for stocks
    stockClient.setHeartbeatCallback(() => {
      const stockHeartbeatTimer = setInterval(() => {
        if (stockClient.isConnected()) {
          const heartbeat = {
            cmd_id: 22000,
            seq_id: 123,
            trace: "stock-heartbeat",
            data: {},
          };
          stockClient.sendMessage(JSON.stringify(heartbeat));
        } else {
          console.log("Stock heartbeat skipped - connection not open");
        }
      }, 10000);

      // Store the timer reference
      timerRef.current = stockHeartbeatTimer;
    });

    // Heartbeat for indices
    indexClient.setHeartbeatCallback(() => {
      const indexHeartbeatTimer = setInterval(() => {
        if (indexClient.isConnected()) {
          const heartbeat = {
            cmd_id: 22000,
            seq_id: 123,
            trace: "index-heartbeat",
            data: {},
          };
          indexClient.sendMessage(JSON.stringify(heartbeat));
        } else {
          console.log("Index heartbeat skipped - connection not open");
        }
      }, 10000);

      // We don't store this timer as we already have one for stocks
      // In a production app, you might want to store both
    });

    // Connect to stock WebSocket
    stockClient.connect(stockWsUrl);
    const stockWs = stockClient.ws;

    // Connect to index WebSocket
    indexClient.connect(indexWsUrl);
    const indexWs = indexClient.ws;

    const handleMessage = (event: MessageEvent) => {
      try {
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
      } catch (e) {
        console.error("Error parsing websocket message:", e);
      }
    };

    const handleError = (error: Event) => {
      setError("Connection error");
      setIsLoading(false);
      reconnectingRef.current = true;
    };

    if (stockWs && indexWs) {
      const handleStockOpen = () => {
        console.log("Stock WebSocket opened");

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
        console.log("Index WebSocket opened");

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
        setError(null);
        reconnectingRef.current = false;
      };

      const handleStockClose = () => {
        if (!reconnectingRef.current) {
          console.log("Stock WebSocket closed");
          setError("Stock connection closed");
          reconnectingRef.current = true;
        }
      };

      const handleIndexClose = () => {
        if (!reconnectingRef.current) {
          console.log("Index WebSocket closed");
          setError("Index connection closed");
          reconnectingRef.current = true;
        }
      };

      stockWs.addEventListener("message", handleMessage);
      stockWs.addEventListener("error", handleError);
      stockWs.addEventListener("open", handleStockOpen);
      stockWs.addEventListener("close", handleStockClose);

      indexWs.addEventListener("message", handleMessage);
      indexWs.addEventListener("error", handleError);
      indexWs.addEventListener("open", handleIndexOpen);
      indexWs.addEventListener("close", handleIndexClose);

      return () => {
        stockWs.removeEventListener("message", handleMessage);
        stockWs.removeEventListener("error", handleError);
        stockWs.removeEventListener("open", handleStockOpen);
        stockWs.removeEventListener("close", handleStockClose);

        indexWs.removeEventListener("message", handleMessage);
        indexWs.removeEventListener("error", handleError);
        indexWs.removeEventListener("open", handleIndexOpen);
        indexWs.removeEventListener("close", handleIndexClose);

        cleanupWebSocketResources();
      };
    }

    // Cleanup on unmount
    return () => {
      cleanupWebSocketResources();
    };
  }, [selectedPair, dispatch]);

  // Effect to handle cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupWebSocketResources();
    };
  }, []);

  // Manual reconnect function
  const handleManualReconnect = () => {
    console.log("Manual reconnect triggered from MarketsData");
    setError(null);
    setIsLoading(true);
    setConnectionStatus("loading");

    if (stockClientRef.current) {
      stockClientRef.current.reconnect();
    }

    if (indexClientRef.current) {
      indexClientRef.current.reconnect();
    }

    setForceUpdate((prev) => prev + 1);
  };

  // Render based on connection status
  if (connectionStatus === "reconnecting") {
    return (
      <div className="p-4 text-[#ffffff9e]">
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Reconnecting to Market Data...
        </div>
        <button
          onClick={handleManualReconnect}
          className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Force Reconnect
        </button>
      </div>
    );
  }

  if (connectionStatus === "loading") {
    return (
      <div className="p-4 text-[#ffffff9e]">
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading Market Data...
        </div>
      </div>
    );
  }

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
            onClick={() => {
              dispatch(setSelectedPair(code));
              dispatch(setChartSymbol(`${chartNames[code]}`));
            }}
            className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              isIndex ? "border-indigo-100" : "border-blue-100"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                <span className={isIndex ? "text-indigo-500" : "text-blue-500"}>
                  {marketNames[code] || code}
                </span>
                <span className="text-[#ffffff9e] text-sm ml-1">({code})</span>
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
              <div className="text-gray-400 text-sm">Loading...</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
