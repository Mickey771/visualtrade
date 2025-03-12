"use client";
import PlaceTrade from "@/components/Trade/PlaceTrade";
import TradingViewChart from "@/components/TradingViewChart";
import React from "react";

const page = () => {
  return (
    <div className="w-full h-fit lg:h-full relative flex flex-col lg:flex-row">
      <div className="w-full  h-[400px] lg:h-full  pt-6 px-6 bg-primaryBlue">
        <TradingViewChart />
      </div>
      <PlaceTrade />
    </div>
  );
};

export default page;
