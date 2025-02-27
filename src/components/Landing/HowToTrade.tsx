import Image from "next/image";
import React from "react";

const hows = [
  {
    id: 1,
    heading: "Sign Up",
    text: "Start your journey by creating your free account",
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
    heading: "Buy / Sale Commodities",
    text:
      "After your account verification, buy or sell your favorite commodities",
    icon: "buysale",
  },
  {
    id: 4,
    heading: "Win and Earn Money",
    text:
      "Earn money by sale or buying commodities on our platform within a short time",
    icon: "winearn",
  },
];

const HowToTrade = () => {
  return (
    <section className="py-[100px] bg-[hsl(222,65%,8%)] ">
      <div className="w-full max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[2.5rem] font-bold text-white">
          How to Trade
        </h2>
        <p className="font-normal mt-5 text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          Trade with trust & reliability across a range of commodity instruments
          including gold, silver, copper, oil, and coffee, enhancing your
          investment strategy
        </p>

        <div className="relative flex flex-col gap-10 mt-10 w-full max-w-[906px] mx-auto  ">
          {hows.map((item, index) => (
            <div
              className={`w-full flex justify-between items-center ${
                index % 2 !== 0 && "flex-row-reverse"
              } `}
            >
              <div className="  bg-[rgb(25,31,46)] p-5 flex flex-col gap-5 w-[380px] rounded-[10px]">
                <p className="w-[56px] h-[56px] bg-base rounded-full flex justify-center items-center text-[2rem] font-semibold">
                  {item.id}
                </p>
                <h3 className="text-[1.25rem] font-bold text-white">
                  {item.heading}
                </h3>
                <p className="w-[300px] text-[rgba(255,255,255,0.7)]">
                  {item.text}
                </p>
              </div>
              <div
                className={`w-[380px]  flex ${
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

          <div className="absolute top-0 left-[50%] w-[1px] h-full bg-[#495057] flex flex-col gap-[220px] justify-center ">
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
