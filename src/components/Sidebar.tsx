// "use client";
import React, { JSX, ReactElement, useEffect, useState } from "react";
import ForexData from "./ForexData";
import CryptoData from "./CryptoData";
import CommoditiesData from "./CommodityData";
import MarketsData from "./StocksIndicesData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import { setSelectedFeed } from "@/redux/reducers/tradeReducer";

const datafeeds = [
  {
    title: "forex",
    component: <ForexData />,
  },
  {
    title: "stocks",
    component: <MarketsData />,
  },
  {
    title: "crypto",
    component: <CryptoData />,
  },
  {
    title: "commodity",
    component: <CommoditiesData />,
  },
];

const Sidebar = () => {
  const { selectedFeed } = useSelector((store: RootState) => store.trade);
  const [activeDatafeed, setActiveDatafeed] = useState<ReactElement>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedFeed) {
      setActiveDatafeed(datafeeds[0].component);
    }
    setActiveDatafeed(
      datafeeds.find((item) => item.title === selectedFeed)?.component
    );
  }, [selectedFeed]);

  return (
    <div className="w-full lg:min-w-[200px] lg:max-w-[350px] bg-primaryBlue h-full flex flex-col items-center py-3 px-5">
      <div className="grid grid-cols-4 gap-3 mt-3 w-full px-2 pb-2 justify-center">
        {datafeeds.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => dispatch(setSelectedFeed(item.title))}
              className={`text-white uppercase text-sm pb-1 font-light ${
                item.title === selectedFeed && "border-b"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="w-full max-h-[300px] lg:max-h-[650px] overflow-y-scroll">
        {/* <ForexData /> */}
        {activeDatafeed}
      </div>
    </div>
  );
};

export default Sidebar;
