import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const faqs = [
  {
    question: "What can be traded?",
    answer: "Stocks, commodities, precious metalss, cryptocurrency, and FX",
  },
  {
    question: "How fast is the withdrawal process?",
    answer:
      "Withdrawal is usually instant, although it can take 1-3 working days.",
  },
  {
    question: "Can I trade with leverage?",
    answer:
      "Yes, you can trade with leverage of 1:200, which can be increased to 1:2000 depending on your trading status.",
  },
  {
    question: "I am a newbie with no trading experience",
    answer:
      "Most of our users are beginner traders; thus, we assign an account manager to guide and assist you in generating money trading.",
  },
  {
    question: "Is the company regulated?",
    answer:
      "We operate under the oversight of the Australian Securites & Investments Commission.",
    linkText:
      "Please click here to view our license on the official government website",
    link:
      "https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchTab=search&searchText=Empower+AI+&searchType=OrgAndBusNm",
  },
  {
    question: "How secure is it?",
    answer:
      "We guarantee the security of each user account with a minimum of $100,000 USD through Allianz Trade Insurance",
  },
];

const FrequentlyAskedQuestions = () => {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section className="py-[50px] md:py-[100px] lg:py-[150px] bg-[rgb(25,31,46)]">
      <div className="w-full px-6 lg:px-0 max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-white">
          <span className="text-[hsl(49,92%,54%)]">Frequently</span> Asked
          Questions
        </h2>
        <p className="font-normal mt-5 text-sm md:text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          Answers to your burning questions, frequently asked questions (faq) -
          find the solutions to common queries and concerns
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 md:mt-20 ">
          {faqs.map((item, index) => (
            <div
              className={`w-full h-fit border-b cursor-pointer border-[rgba(255,255,255,0.1)]  ${
                active === index ? "pb-[23px]" : "pb-[0px]"
              } `}
              onClick={() =>
                setActive((prev) => {
                  if (prev === index) {
                    return null;
                  }
                  return index;
                })
              }
              key={index}
            >
              <div className="flex justify-between py-[23px]">
                <h2 className="text-white font-semibold">{item.question}</h2>
                <span className="text-white text-xl md:text-2xl lg:text-3xl">
                  {active === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {active === index && (
                <p className="text-[rgba(255,255,255,0.7)]">
                  {item.answer}{" "}
                  {item.link && (
                    <a
                      className="text-blue-500"
                      target="_blank"
                      href={item.link}
                    >
                      {item.linkText}
                    </a>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
