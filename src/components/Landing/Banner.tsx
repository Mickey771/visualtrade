import Image from "next/image";
import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

const Banner = () => {
  return (
    <div
      className="h-lvh w-full relative"
      style={{
        backgroundImage: `url(https://script.viserlab.com/visertrade/assets/images/frontend/banner/65f552af8be571710576303.png)`,
      }}
    >
      <div className="absolute top-0 left-0 radial-bg w-full h-full flex flex-col  justify-center items-center">
        <h1 className="text-[65px] text-white font-bold text-center ">
          Trade Commodities With <br /> Confidence In Our Platform
        </h1>
        <p className="max-w-[600px] text-[1rem] font-normal mt-6 text-white text-center">
          Optimize your trading strategy with advantageous conditions for
          precious metals and energies, ensuring profitability & resilience
        </p>

        <div className="mt-10 flex gap-20">
          <div className="w-full flex gap-5">
            <div className="w-full max-w-[70px]">
              <Image
                src={"/bolt.png"}
                width={0}
                height={0}
                alt="bolt"
                style={{ width: "100%", height: "100%" }}
                sizes="100vw"
                className="w-full min-w-[40px]"
              />
            </div>
            <div className="flex flex-col gap-3 ">
              <span className="text-[1.25rem] text-white">Built for</span>
              <p className="text-[1.25rem] w-max font-bold text-white">
                Super Traders
              </p>
            </div>
          </div>
          <div className="w-[5px] h-[60px] bg-gradient-to-b from-[#ffffff26] via-[#bbbbbb] to-[#ffffff26] "></div>
          <div className="w-full flex gap-5">
            <div className="w-full max-w-[70px]">
              <Image
                src={"/coin.png"}
                width={0}
                height={0}
                alt="bolt"
                style={{ width: "100%", height: "100%" }}
                sizes="100vw"
                className="w-full min-w-[70px] object-contain"
              />
            </div>
            <div className="flex flex-col gap-3 ">
              <span className="w-max text-[1.25rem] text-white">
                Tailored Trading
              </span>
              <p className="text-[1.25rem] w-max font-bold text-white">Elite</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-5">
          <button className="w-[230px] py-5 bg-base bg-gradient-to-r from-base to-[#fff3be] hover:from-[#fff3be] hover:to-base rounded-[16px] text-[1.125rem] font-semibold flex gap-2 items-center justify-center">
            Register
            <span>
              <FaArrowTrendUp />
            </span>
          </button>
          <button className="w-[230px] text-base hover:text-black border border-base py-5 bg-transparent hover:bg-gradient-to-r hover:from-base hover:to-[#fff3be]  rounded-[16px] text-[1.125rem] font-semibold flex gap-2 items-center justify-center">
            Login
            <span>
              <FaArrowTrendUp />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
