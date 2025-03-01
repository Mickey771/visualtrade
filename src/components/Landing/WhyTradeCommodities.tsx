import Image from "next/image";
import React from "react";
import { FaPlay } from "react-icons/fa";

const whys = [
  {
    image: "low",
    heading: "Low & Stable Spreads",
    text: "Super competitive spreads with ultra fast execution speed",
  },
  {
    image: "fast",
    heading: "Fast Execution",
    text: "Never miss a pip. Get your orders executed in milliseconds.",
  },
  {
    image: "security",
    heading: "Security of Funds",
    text: "Trade the commodity markets with negative balance protection",
  },
  {
    image: "excellent",
    heading: "Excellent Community",
    text:
      "There is an active team behind us, and we adore communicating with our users",
  },
];

const WhyTradeCommodities = () => {
  return (
    <section className="py-[50px] md:py-[100px] lg:py-[150px] bg-[rgb(25,31,46)]">
      <div className="w-full px-6 lg:px-0 max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-white">
          Why Trade With Us?
        </h2>
        <p className="font-normal mt-5 text-sm md:text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          Trade for profit, diversification, and protection against inflation,
          leveraging their inherent value and market dynamics to fortify your
          portfolio
        </p>

        <div className="w-full mt-10 flex flex-wrap md:flex-nowrap gap-14">
          <div className="relative w-full md:max-w-[50%]">
            <Image
              src="/candlebars.png"
              width={0}
              height={0}
              alt="candlebars"
              sizes="100vw"
              style={{ width: "100%", height: "100%" }}
            />
            <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
              <span className="inline-flex p-8 rounded-full text-white text-2xl bg-[rgba(25,31,46,0.7)]">
                <FaPlay />
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 gap-y-8">
            {whys.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-6">
                <div className="w-full max-w-[50px]">
                  <Image
                    src={`/${item.image}.png`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "100%" }}
                    alt={item.heading}
                  />
                </div>
                <h3 className="text-white text-[1.25rem] text-center md:text-left font-semibold">
                  {item.heading}
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] text-center md:text-left">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTradeCommodities;
