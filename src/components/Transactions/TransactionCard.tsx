// components/TransactionCard.tsx
import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Function to extract trading pair in a readable format
  const formatPair = (pair: string) => {
    if (pair.length === 6) {
      return `${pair.slice(0, 3)}/${pair.slice(3, 6)}`;
    }
    return pair;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
              transaction.type === "BUY" ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            {transaction.type === "BUY" ? (
              <FaArrowUp className="text-green-500" />
            ) : (
              <FaArrowDown className="text-red-500" />
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">
              {formatPair(transaction.meta_data.pair)}
            </h3>
            <p className="text-gray-400 text-sm">{transaction.id}</p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`font-semibold ${
              transaction.type === "BUY" ? "text-green-500" : "text-red-500"
            }`}
          >
            {transaction.type}
          </p>
          <p className="text-gray-400 text-sm">
            {formatDate(transaction.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-gray-700/50 p-2 rounded">
          <p className="text-gray-400 text-xs">Price</p>
          <p className="text-white">
            ${transaction.meta_data.boughtAt || transaction.price.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded">
          <p className="text-gray-400 text-xs">Quantity</p>
          <p className="text-white">
            {transaction.meta_data.quantity?.toLocaleString() || "-"}
          </p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded">
          <p className="text-gray-400 text-xs">Leverage</p>
          <p className="text-white">
            {transaction.meta_data.leverage
              ? `1:${transaction.meta_data.leverage}`
              : "-"}
          </p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded">
          <p className="text-gray-400 text-xs">Margin</p>
          <p className="text-white">${transaction.meta_data.margin || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
