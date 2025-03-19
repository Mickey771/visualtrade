// app/transactions/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { BiDownload } from "react-icons/bi";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const router = useRouter();

  const fetchTransactions = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transactions?page=${page}`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error, redirect to login
          router.push("/login");
          return;
        }
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data: TransactionsResponse = await response.json();

      if (data.status === "success") {
        setTransactions(data.data);
        setHasNextPage(data.has_next);
      } else {
        throw new Error(data.message || "Failed to fetch transactions");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching transactions"
      );
      console.error("Transaction fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

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

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    // Create CSV content
    const headers = [
      "ID",
      "Type",
      "Pair",
      "Price",
      "Quantity",
      "Leverage",
      "Margin",
      "Order Type",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          t.id,
          t.type,
          t.meta_data.pair,
          t.price,
          t.meta_data.quantity || "-",
          t.meta_data.leverage || "-",
          t.meta_data.margin || "-",
          t.meta_data.order_type || "-",
          formatDate(t.created_at),
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0d1d2c]">
      <Navbar />

      <div className="max-w-7xl pt-16 lg:pt-8 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Transaction History
          </h1>

          <button
            onClick={exportToCSV}
            disabled={transactions.length === 0 || loading}
            className="flex items-center gap-2 bg-[#18a0fb] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BiDownload size={20} />
            Export CSV
          </button>
        </div>

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

        {!loading && !error && transactions.length === 0 && (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">No transactions found</p>
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <>
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
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Leverage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-700">
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
                        {transaction.meta_data.boughtAt ||
                          transaction.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.meta_data.quantity?.toLocaleString() ||
                          "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.meta_data.leverage
                          ? `1:${transaction.meta_data.leverage}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(transaction.created_at)}
                      </td>
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
      </div>
    </div>
  );
};

export default TransactionsPage;
