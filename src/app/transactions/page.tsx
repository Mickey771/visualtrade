"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { BiDownload } from "react-icons/bi";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionsTable from "@/components/Transactions/TransactionsTable";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";

const TransactionsPage = () => {
  const {
    loading,
    error,
    exportToCSV,
    transactions,
    formatDate,
    formatPair,
    handlePageChange,
    hasNextPage,
    currentPage,
  } = useTransactions();

  // Add state for active tab
  const [activeTab, setActiveTab] = useState("all");

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    switch (activeTab) {
      case "open":
        return transactions.filter((transaction) => !transaction.closed);
      case "closed":
        return transactions.filter((transaction) => transaction.closed);
      case "all":
      default:
        return transactions;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1d2c]">
      <Navbar />

      <div className="max-w-7xl pt-16 lg:pt-8 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href={"/trade"}>
            <button className="flex h-fit items-center gap-2 bg-[#18a0fb] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <IoChevronBack />
              Back
            </button>
          </Link>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
            Transaction History
          </h1>

          <button
            onClick={exportToCSV}
            disabled={transactions.length === 0 || loading}
            className="zr:hidden md:flex h-fit items-center gap-2 bg-[#18a0fb] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BiDownload size={20} />
            Export CSV
          </button>
        </div>

        {/* Add tabs for filtering */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "all"
                ? "text-[#18a0fb] border-b-2 border-[#18a0fb]"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Transactions
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "open"
                ? "text-[#18a0fb] border-b-2 border-[#18a0fb]"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("open")}
          >
            Open Positions
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "closed"
                ? "text-[#18a0fb] border-b-2 border-[#18a0fb]"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("closed")}
          >
            Closed Positions
          </button>
        </div>

        <TransactionsTable
          loading={loading}
          error={error}
          transactions={getFilteredTransactions()}
          formatDate={formatDate}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          formatPair={formatPair}
          isClosed={activeTab === "open"} // Pass true when in 'open' tab to show close position button
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
