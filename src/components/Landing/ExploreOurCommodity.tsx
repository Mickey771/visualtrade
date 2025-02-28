import Image from "next/image";
import React from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const commodities = [
  {
    image: "copper",
    name: "Copper",
    price: "5.00",
    volume24h: -0.05,
    volume7d: -0.42,
    marketCapital: "5,465,654,564.00",
  },
  {
    image: "cotton",
    name: "Cotton",
    price: "0.50",
    volume24h: 2.0,
    volume7d: 3.0,
    marketCapital: "1,222,222,222.00",
  },
  {
    image: "crud",
    name: "Crud Oil",
    price: "80.63",
    volume24h: -1.84,
    volume7d: 4.21,
    marketCapital: "4,512,454,634,254.00",
  },
  {
    image: "gasoline",
    name: "Gasoline",
    price: "5.00",
    volume24h: -0.05,
    volume7d: 0.42,
    marketCapital: "5,465,654,564.00",
  },
  {
    image: "gold",
    name: "Gold",
    price: "0.50",
    volume24h: 2.0,
    volume7d: 3.0,
    marketCapital: "1,222,222,222.00",
  },
  {
    image: "natural",
    name: "Natural Gas",
    price: "80.63",
    volume24h: -1.84,
    volume7d: 4.21,
    marketCapital: "4,512,454,634,254.00",
  },
  {
    image: "platinum",
    name: "Platinum",
    price: "5.00",
    volume24h: -0.05,
    volume7d: 0.42,
    marketCapital: "5,465,654,564.00",
  },
  {
    image: "rice",
    name: "Rice",
    price: "5.00",
    volume24h: -0.05,
    volume7d: 0.42,
    marketCapital: "5,465,654,564.00",
  },
  {
    image: "silver",
    name: "Silver",
    price: "80.63",
    volume24h: -1.84,
    volume7d: 4.21,
    marketCapital: "4,512,454,634,254.00",
  },
  {
    image: "soybeans",
    name: "Soybeans",
    price: "0.50",
    volume24h: 2.0,
    volume7d: 3.0,
    marketCapital: "1,222,222,222.00",
  },
  {
    image: "titanium",
    name: "Titanium",
    price: "80.63",
    volume24h: -1.84,
    volume7d: 4.21,
    marketCapital: "4,512,454,634,254.00",
  },
  {
    image: "uranium",
    name: "Uranium",
    price: "0.50",
    volume24h: 2.0,
    volume7d: 3.0,
    marketCapital: "1,222,222,222.00",
  },
];

const ExploreOurCommodity = () => {
  return (
    <section className="py-[50px] md:py-[150px] lg:py-[150px] bg-[rgb(25,31,46)] ">
      <div className="w-full px-6 lg:px-0 max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-white">
          <span className="text-[hsl(49,92%,54%)]"> Explore </span>Our Commodity
        </h2>
        <p className="font-normal mt-5 text-sm md:text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          Discover a vast selection of high-quality goods at competitive prices
          across a wide range of categories and industries
        </p>

        <div className="w-full overflow-x-scroll">
          <table className="min-w-[900px] w-full bg-[hsl(223,64%,8%)] rounded-[6px] text-white mt-12">
            <thead className="py-4 px-5 text-[rgba(255,255,255,0.5)] font-semibold grid grid-cols-6 w-full text-center border-b border-[rgb(25,31,46)]">
              <td>Commodities</td>
              <td>Current Price</td>
              <td>24h%</td>
              <td>7d%</td>
              <td>Market Capital</td>
              <td></td>
            </thead>
            <tbody>
              {commodities.map((item, index) => (
                <tr className=" px-5 border-y border-[rgb(25,31,46)] grid grid-cols-6 w-full text-center">
                  <td className="py-4 border-r border-[rgb(25,31,46)]  flex gap-5 items-center">
                    <span className="inline-flex w-full max-w-[40px]">
                      <Image
                        src={`/${item.image}.png`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "100%" }}
                        alt={item.name}
                      />
                    </span>
                    <span className="font-semibold">{item.name}</span>
                  </td>
                  <td className="flex items-center justify-center">
                    ${item.price}
                  </td>
                  <td className="flex items-center gap-1 justify-center">
                    {item.volume24h}%
                    {item.volume24h < 0 ? (
                      <FaArrowTrendDown color="red" />
                    ) : (
                      <FaArrowTrendUp color="green" />
                    )}
                  </td>
                  <td className="flex items-center gap-1 justify-center">
                    {item.volume7d}%
                    {item.volume24h < 0 ? (
                      <FaArrowTrendDown color="red" />
                    ) : (
                      <FaArrowTrendUp color="green" />
                    )}
                  </td>
                  <td className="flex items-center justify-center">
                    ${item.marketCapital}
                  </td>
                  <button className="my-6 py-2 px-6 text-[14px] mx-auto w-fit flex items-center justify-center text-black font-semibold gap-1 rounded-[12px] bg-gradient-to-r from-[#fff3be] to-base hover:from-base hover:to-[#fff3be]">
                    <span>
                      <FaArrowTrendUp />
                    </span>
                    <span>TRADE NOW</span>
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-base py-[35px] mt-20 flex flex-wrap gap-5 flex-col md:flex-row lg:gap-0 justify-center items-center text-center">
        <div className="flex flex-col md:px-[80px] gap-2">
          <h3 className="text-[1.5rem] md:text-[2rem] font-bold">
            12 Trillion
          </h3>
          <p className="text-[1rem] md:text-[1.125rem]">
            Monthly Trading Volume
          </p>
        </div>
        <div className="zr:hidden md:flex w-[2px] h-[60px] bg-gradient-to-b from-[#6c757d] via-[#6c757d] to-[rgb(108,117,125)]  "></div>
        <div className="flex flex-col md:px-[80px] gap-2 ">
          <h3 className="text-[1r.5em] md:text-[2rem] font-bold">
            2.5 Billion
          </h3>
          <p className=" text-[1rem] md:text-[1.125rem]">
            Trades Executed in 2024
          </p>
        </div>
        <div className="zr:hidden md:flex w-[2px] h-[60px] bg-gradient-to-b from-[#6c757d] via-[#6c757d] to-[rgb(108,117,125)]  "></div>
        <div className="flex flex-col md:px-[80px] gap-2 ">
          <h3 className="text-[1.5rem] md:text-[2rem] font-bold">64,000 +</h3>
          <p className="text-[1rem] md:text-[1.125rem]">Registered Partners</p>
        </div>
        <div className="zr:hidden md:flex w-[2px] h-[60px] bg-gradient-to-b from-[#6c757d] via-[#6c757d] to-[rgb(108,117,125)]  "></div>
        <div className="flex flex-col md:px-[80px] gap-2 ">
          <h3 className="text-[1.5rem] md:text-[2rem] font-bold">4.6 +</h3>
          <p className="text-[1rem] md:text-[1.125rem]">Trustpilot Rating</p>
        </div>
      </div>
    </section>
  );
};

export default ExploreOurCommodity;
