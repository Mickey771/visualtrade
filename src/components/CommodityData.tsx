import { useEffect, useState, useRef } from "react";
import { wsClient } from "@/utils/websocket";
import { useMarketData } from "@/hooks/useMarketData";
import { setSelectedPair } from "@/redux/reducers/tradeReducer";

interface PriceLevel {
  price: string;
  volume: string;
}

interface CommodityData {
  cmd_id: number;
  data: {
    code: string;
    seq: string;
    tick_time: string;
    bids: PriceLevel[];
    asks: PriceLevel[];
  };
}

export default function CommoditiesData() {
  const {
    pairs: commodities,
    marketData: commodityData,
    isLoading,
    error,
    dispatch,
  } = useMarketData();

  // Format display names
  const commodityNames: { [key: string]: string } = {
    GOLD: "Gold",
    SILVER: "Silver",
    Zinc: "Zinc",
    COPPER: "Copper",
    Palladium: "Palladium",
    Platinum: "Platinum",
    Nickel: "Nickel",
    Lead: "Lead",
    NGAS: "Natural Gas",
    USOIL: "US Crude Oil",
    UKOIL: "UK Crude Oil",
  };

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (isLoading)
    return (
      <div className="p-4 text-[#ffffff9e]">Loading Commodities Data...</div>
    );

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
      {commodities.map((code) => {
        const data = commodityData[code.toUpperCase()];
        const bestBid = data?.data?.bids?.[0]?.price || "0";
        const bestAsk = data?.data?.asks?.[0]?.price || "0";
        const bid = parseFloat(bestBid);
        const ask = parseFloat(bestAsk);
        const spread = ask - bid;

        return (
          <div
            key={code}
            onClick={() => dispatch(setSelectedPair(code))}
            className="border rounded-lg p-4  shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-red-500">
                {commodityNames[code]}
              </h3>
              {data && (
                <span className="text-[12px] text-[#ffffff9e]">
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
                  <span className="text-purple-500 font-mono">
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
