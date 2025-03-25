// app/transactions/page.tsx
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { BiDownload } from "react-icons/bi";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionsTable from "@/components/Transactions/TransactionsTable";

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

        <TransactionsTable
          loading={loading}
          error={error}
          transactions={transactions}
          formatDate={formatDate}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          formatPair={formatPair}
          isClosed={false}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
