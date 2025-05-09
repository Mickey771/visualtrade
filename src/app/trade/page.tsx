"use client";
import Sidebar from "@/components/Sidebar";
import PlaceTrade from "@/components/Trade/PlaceTrade";
import TradingViewChart from "@/components/TradingViewChart";
import TransactionsTable from "@/components/Transactions/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import React from "react";

const page = () => {
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
    fetchTransactions,
  } = useTransactions();
  return (
    <div className="flex bg-primaryBlue pt-14 md:pt-0 flex-col lg:flex-row min-h-lvh border-t-2 border-[#040b11]">
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full flex flex-col gap-20">
          <div className="w-full flex flex-col lg:flex-row">
            <Sidebar />
            <div className="w-full   h-[400px] lg:h-full  pt-6 px-6 bg-primaryBlue">
              <TradingViewChart />
            </div>
          </div>
        </div>
        <PlaceTrade
          fetchTransactions={fetchTransactions}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default page;
