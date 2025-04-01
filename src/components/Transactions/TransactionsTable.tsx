import { useDisclosure } from "@/hooks/useDisclosure";
import React, { useEffect, useState } from "react";
import ClosePositionModal from "../Modals/ClosePositionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedPair,
  setSelectedTransaction,
} from "@/redux/reducers/tradeReducer";
import { RootState } from "@/redux/reducers";
import { useRealTimePLCalculator } from "../useRealTimePLCalculator";

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  loading,
  error,
  transactions,
  formatDate,
  handlePageChange,
  currentPage,
  hasNextPage,
  formatPair,
  isClosed,
}) => {
  const [isHovering, setIsHovering] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  const { selectedTransaction, selectedPairPrice } = useSelector(
    (store: RootState) => store.trade
  );

  const closePositionModal = useDisclosure();
  const dispatch = useDispatch();

  // Get the real-time P/L calculator
  const {
    plData,
    wsConnected,
    formatPL,
    formatPLPercentage,
  } = useRealTimePLCalculator(transactions);

  useEffect(() => {
    if (!isClosed) {
      // Show closed transactions when viewing transaction history
      setFilteredTransactions(transactions);
    } else {
      // Show only open positions when viewing active positions
      setFilteredTransactions(transactions?.filter((item) => !item.closed));
    }
  }, [transactions, isClosed]);

  // Helper function to format profit/loss with color
  const formatProfitLoss = (transaction: Transaction) => {
    if (transaction.closed) {
      // For closed positions, use stored profit/loss
      const profitLoss = transaction.meta_data.profitLoss;
      if (profitLoss === undefined) return "-";

      const formattedValue = parseFloat(profitLoss.toString()).toFixed(2);
      const isPositive = parseFloat(profitLoss.toString()) >= 0;

      return (
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "+" : ""}
          {formattedValue}
        </span>
      );
    } else {
      // For open positions, use real-time calculations
      const realtimePL = plData[transaction.id];
      if (!realtimePL)
        return <span className="text-gray-400">Calculating...</span>;

      return formatPL(realtimePL.amount);
    }
  };

  // Helper function to format profit/loss percentage
  const formatProfitLossPercentage = (transaction: Transaction) => {
    if (transaction.closed) {
      // For closed positions, use stored percentage
      const percentage = transaction.meta_data.profitLossPercentage;
      if (percentage === undefined) return "-";

      const formattedValue = parseFloat(percentage.toString()).toFixed(2);
      const isPositive = parseFloat(percentage.toString()) >= 0;

      return (
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "+" : ""}
          {formattedValue}%
        </span>
      );
    } else {
      // For open positions, use real-time calculations
      const realtimePL = plData[transaction.id];
      if (!realtimePL)
        return <span className="text-gray-400">Calculating...</span>;

      return formatPLPercentage(realtimePL.percentage);
    }
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18a0fb]"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {!loading && !error && transactions?.length === 0 && (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">No transactions found</p>
        </div>
      )}

      {!loading && !error && transactions?.length > 0 && (
        <>
          {!wsConnected && !isClosed && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-2 rounded-md mb-4">
              <span className="animate-pulse mr-2">⚪</span>
              Connecting to market data...
            </div>
          )}

          {/* {wsConnected && !isClosed && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-2 rounded-md mb-4">
              <span className="mr-2">🟢</span>
              Live market data connected - P/L updating in real-time
            </div>
          )} */}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Pair
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Entry Price
                  </th>
                  {!isClosed && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Exit Price
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Leverage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    P/L
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    P/L %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTransactions?.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-700 relative"
                    onClick={() => setIsHovering(transaction.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.id.slice(0, 8)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === "BUY"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatPair(transaction.meta_data.pair)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.meta_data.boughtAt}
                    </td>
                    {!isClosed && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.meta_data.closedAt ||
                          (!transaction.closed && (
                            <span className="text-yellow-500 animate-pulse">
                              Live
                            </span>
                          ))}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${transaction.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.meta_data.leverage
                        ? `1:${transaction.meta_data.leverage}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatProfitLoss(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatProfitLossPercentage(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(transaction.created_at)}
                    </td>

                    {isHovering === transaction.id &&
                      isClosed &&
                      !transaction.closed && (
                        <div className="absolute top-0 left-0 w-full h-full bg-[#0000008b] flex justify-end py-1 px-4">
                          <button
                            onClick={() => {
                              dispatch(setSelectedTransaction(transaction));
                              dispatch(
                                setSelectedPair(transaction.meta_data.pair)
                              );
                              closePositionModal.open();
                            }}
                            className="py-2 px-8 bg-red-400 text-white rounded-[6px]"
                          >
                            Close
                          </button>
                        </div>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-300">Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ClosePositionModal modal={closePositionModal} />
    </>
  );
};

export default TransactionsTable;
