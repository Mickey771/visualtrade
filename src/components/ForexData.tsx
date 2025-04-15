import { useMarketData } from "@/hooks/useMarketData";
import {
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
  } = useMarketData();

  if (error) return <div className="p-4 text-[#ffffff9e]">Reconnecting...</div>;
  if (isLoading)
    return <div className="p-4 text-gray-600">Loading Forex Data...</div>;

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
            onClick={() => dispatch(setSelectedPair(pair))}
            className="border rounded-lg p-4  shadow-sm hover:shadow-md transition-shadow"
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
