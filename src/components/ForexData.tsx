import React, { useEffect, useState } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import {
  setChartSymbol,
  setSelectedFeed,
  setSelectedPair,
} from "@/redux/reducers/tradeReducer";

export default function ForexData() {
  const {
    pairs: currencyPairs,
    marketData: forexData,
    isLoading,
    error,
    dispatch,
    reconnect,
    forceUpdate, // Use the forceUpdate counter from the hook
  } = useMarketData();

  // Local state to track connection status for UI purposes
  const [connectionStatus, setConnectionStatus] = useState("connected");

  // Update local connection status based on hook state
  useEffect(() => {
    if (error) {
      setConnectionStatus("reconnecting");
    } else if (isLoading) {
      setConnectionStatus("loading");
    } else {
      setConnectionStatus("connected");
    }
  }, [error, isLoading, forceUpdate]); // Add forceUpdate to trigger this effect

  // Add global error listener as a backup measure
  useEffect(() => {
    const handleReconnected = () => {
      console.log("ForexData component handling reconnection event");
      setConnectionStatus("connected");
    };

    window.addEventListener("websocket_reconnected", handleReconnected);
    return () => {
      window.removeEventListener("websocket_reconnected", handleReconnected);
    };
  }, []);

  // Add manual reconnect functionality for backup
  const handleManualReconnect = () => {
    console.log("Manual reconnect triggered");
    reconnect();
    setConnectionStatus("loading");
  };

  // Render based on connection status rather than relying directly on hook state
  if (connectionStatus === "reconnecting") {
    return (
      <div className="p-4 text-[#ffffff9e]">
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-[#18a0fb]"
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
          Reconnecting...
        </div>
        <button
          onClick={handleManualReconnect}
          className="mt-4 px-3 py-1 bg-[#18a0fb] text-white rounded hover:bg-blue-700 transition-colors"
        >
          Force Reconnect
        </button>
      </div>
    );
  }

  if (connectionStatus === "loading") {
    return (
      <div className="p-4 text-gray-600">
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-[#18a0fb]"
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
          Loading Forex Data...
        </div>
      </div>
    );
  }

  // No data yet or no pairs available
  if (!currencyPairs || currencyPairs.length === 0) {
    return (
      <div className="p-4 text-[#ffffff9e]">No currency pairs available</div>
    );
  }

  return (
    <div className="w-full grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
      {currencyPairs.map((pair: string) => {
        const data = forexData[pair];
        const bestBid = data?.data?.bids?.[0]?.price || "0";
        const bestAsk = data?.data?.asks?.[0]?.price || "0";
        const bid = parseFloat(bestBid);
        const ask = parseFloat(bestAsk);
        const spread = ask - bid;

        return (
          <div
            key={pair}
            onClick={() => {
              dispatch(setSelectedPair(pair));
              dispatch(setChartSymbol(`FX:${pair}`));
            }}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-[#18a0fb]">
                {pair.slice(0, 3)}/{pair.slice(3)}
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
                    {bid.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ffffff9e]">Best Ask:</span>
                  <span className="text-red-600 font-mono">
                    {ask.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-[#ffffff9e]">Spread:</span>
                  <span className="text-purple-600 font-mono">
                    {spread.toFixed(5)}
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
