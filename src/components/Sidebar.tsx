// "use client";
import React, { JSX, useState } from "react";
import StockData from "./StockData";
import ForexData from "./ForexData";
import CryptoData from "./CryptoData";
import CommoditiesData from "./CommodityData";

const datafeeds = [
  <ForexData />,
  <StockData />,
  <CryptoData />,
  <CommoditiesData />,
];

const Sidebar = () => {
  const [activeDatafeed, setActiveDatafeed] = useState(0);
  return (
    <div className="w-full lg:w-[400px] bg-primaryBlue h-full flex flex-col items-center py-3 px-5">
      {/* <input
        type="text"
        className="w-full py-2 px-3 bg-secondaryBlue"
        placeholder="Search"
      /> */}

      <div className="grid grid-cols-4 gap-4 mt-3 w-full px-2 pb-2 justify-center">
        <button
          onClick={() => setActiveDatafeed(0)}
          className="text-white text-sm font-light"
        >
          FOREX
        </button>
        <button
          onClick={() => setActiveDatafeed(1)}
          className="text-white text-sm font-light"
        >
          STOCKS
        </button>
        <button
          onClick={() => setActiveDatafeed(2)}
          className="text-white text-sm font-light"
        >
          CRYPTO
        </button>
        <button
          onClick={() => setActiveDatafeed(3)}
          className="text-white text-sm font-light"
        >
          COM
        </button>
      </div>

      <div className="w-full max-h-[300px] lg:max-h-[650px] overflow-y-scroll">
        {/* <ForexData /> */}
        {datafeeds[activeDatafeed]}
      </div>
    </div>
  );
};

export default Sidebar;
