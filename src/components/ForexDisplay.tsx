import { useForexData } from "../hooks/useForexData";

interface ForexDisplayProps {
  symbols: string[];
  refreshInterval?: number;
}

export default function ForexDisplay({
  symbols,
  refreshInterval = 5000,
}: ForexDisplayProps) {
  const { data, loading, error } = useForexData(symbols, refreshInterval);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(data).map(([symbol, quote]) => (
        <div key={symbol} className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">{symbol}</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Price:</span>
              <span className="font-medium">{quote.last.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ask:</span>
              <span className="font-medium">{quote.ask}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bid:</span>
              <span className="font-medium">{quote.bid}</span>
            </div>
            <div className="text-xs text-gray-500 text-right">
              Last updated:{" "}
              {new Date(quote.last.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
