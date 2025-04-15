import { useEffect, useState, useRef } from "react";
import { wsClient } from "@/utils/websocket";
import { useMarketData } from "@/hooks/useMarketData";
import { setSelectedPair } from "@/redux/reducers/tradeReducer";

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
  const {
    pairs,
    marketData: cryptoData,
    isLoading,
    error,
    dispatch,
  } = useMarketData();

  if (error) return <div className="p-4 text-[#ffffff9e]">Reconnecting...</div>;
  if (isLoading)
    return <div className="p-4 text-[#ffffff9e]">Loading Crypto Data...</div>;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
      {pairs.map((pair) => {
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
            onClick={() => dispatch(setSelectedPair(pair.replace("/", "")))}
            className="border rounded-lg p-4  shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-red-500">
                {pair.split("/")[0]}
                <span className="text-[#ffffff9e]">/{pair.split("/")[1]}</span>
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
                    ${bid.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ffffff9e]">Best Ask:</span>
                  <span className="text-red-500 font-mono">
                    ${ask.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-[#ffffff9e]">Spread:</span>
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
