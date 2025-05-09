import Image from "next/image";
import React from "react";

const hows = [
  {
    id: 1,
    heading: "Login",
    text: "Start your journey by logging into your account",
    icon: "signup",
  },
  {
    id: 2,
    heading: "Verify Account",
    text: "Quickly verify your account including email, sms, KYC verification",
    icon: "verify",
  },
  {
    id: 3,
    heading: "Start Trading",
    text:
      "Get a professional strategy/trading plan from your Personal account manager",
    icon: "buysale",
  },
  {
    id: 4,
    heading: "Earn Money",
    text: "Earn money by trading on our platform within a short time",
    icon: "winearn",
  },
];

const HowToTrade = () => {
  return (
    <section className="py-[50px] md:py-[100px] lg:py-[150px] bg-[hsl(222,65%,8%)] ">
      <div className="w-full px-6 lg:px-0 max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-white">
          How to Trade
        </h2>
        <p className="font-normal mt-5 text-sm md:text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          Trade with trust & reliability across a range of instruments including
          precious metals, energies, crypto, equity investments, and FX
        </p>

        <div className="relative flex flex-col gap-10 mt-10 w-full max-w-[906px] mx-auto  ">
          {hows.map((item, index) => (
            <div
              className={`relative w-full  flex justify-between items-center ${
                index % 2 !== 0 && "flex-row-reverse"
              } `}
            >
              <div className="absolute z-[2] w-full top-[10%] flex items-center justify-center left-0">
                <div className="w-4 h-4 bg-base rounded-full"></div>
              </div>
              <div className="  bg-[rgb(25,31,46)] p-5 flex flex-col gap-5 w-full items-center md:items-start lg:w-[380px] rounded-[10px]">
                <p className="w-[56px] h-[56px] bg-base rounded-full flex justify-center items-center text-[2rem] font-semibold">
                  {item.id}
                </p>
                <h3 className="text-[1.25rem] font-bold text-white">
                  {item.heading}
                </h3>
                <p className="w-full md:w-[300px] text-center md:text-left text-[rgba(255,255,255,0.7)]">
                  {item.text}
                </p>
              </div>
              <div
                className={`w-[380px] zr:hidden md:flex ${
                  index % 2 !== 0 && "justify-end"
                }`}
              >
                <div className="w-full max-w-[64px]">
                  <Image
                    src={`/${item.icon}.png`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "100%" }}
                    alt={item.heading}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="zr:hidden md:flex absolute top-0 left-[50%] -translate-x-[0.5px] w-[1px] h-full bg-[#495057] flex flex-col gap-[220px] justify-center ">
            {/* <div className="h-[15px] w-[15px] bg-base rounded-full "></div>
            <div className="h-[15px] w-[15px] bg-base rounded-full "></div>
            <div className="h-[15px] w-[15px] bg-base rounded-full "></div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToTrade;
