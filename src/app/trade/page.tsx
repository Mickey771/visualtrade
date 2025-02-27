"use client";
import TradingViewChart from "@/components/TradingViewChart";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";

const page = () => {
  return (
    <div className="w-full h-fit lg:h-full relative flex flex-col lg:flex-row">
      <div className="w-full  h-[400px] lg:h-full  pt-6 px-6 bg-primaryBlue">
        <TradingViewChart />
      </div>
      <div className="w-full lg:w-[400px] pb-10 lg:pb-0 bg-primaryBlue">
        <div className="flex">
          <h2 className="text-[#18a0fb] text-lg px-1 text-center w-full py-3 border-b border-[#18a0fb]">
            OPEN DEAL
          </h2>
          <h2 className="text-white font-light text-lg px-1 text-center w-full py-3 border-b">
            LIMIT ORDER
          </h2>
        </div>

        <div className="flex flex-col px-5 mt-5">
          <div className="flex justify-between items-center pb-6 border-b border-[#b1aaaaa6]">
            <h2 className="text-2xl text-white font-semibold">EUR/USD</h2>
            <p className="text-[#18a0fb] text-lg">FX</p>
          </div>

          <div className="flex justify-between items-center mt-8">
            <p className="text-[#ffffff9e]">LEVERAGE:</p>
            <p className="text-white font-semibold">1:200</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-[#ffffff9e]">CHANGE:</p>
            <p className=" font-semibold text-red-600">-0.30%</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-[#ffffff9e]">MARGIN:</p>
            <p className=" font-semibold text-green-500">$257</p>
          </div>

          <div className="flex gap-3 border border-[#18a0fb] rounded-[10px] px-3 py-2 text-white mt-5 w-full justify-between items-center">
            <span>
              <FiMinus size={30} />
            </span>
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-2xl">50,000</h1>
              <p className="text-sm">EUR</p>
            </div>
            <span>
              <FaPlus size={30} />
            </span>
          </div>

          <button className="w-full flex justify-between mt-8 px-3 py-2 bg-[#18a0fb] shadow-lg rounded-[6px]">
            <p className="font-bold text-white">BUY</p>
            <p className="text-white text-sm font-light">
              1.02 <span className="text-lg">69</span>
            </p>
          </button>
          <button className="w-full flex justify-between mt-6 px-3 py-2 bg-[#18a0fb] shadow-lg rounded-[6px]">
            <p className="font-bold text-white">SELL</p>
            <p className="text-white text-sm font-light">
              1.02 <span className="text-lg">69</span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
