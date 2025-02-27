import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const faqs = [
  {
    question: "What commodities can be traded?",
    answer:
      "Agricultural products, energy resources, precious metals, base metals, and soft commodities.",
  },
  {
    question: "What is a commodities trade?",
    answer:
      "A digital marketplace where traders buy and sell commodities like agricultural products, energy resources, and precious metals.",
  },
  {
    question: "What are the benefits?",
    answer:
      "Accessibility, liquidity, diverse options, and advanced trading tools.",
  },
  {
    question: "Is it regulated?",
    answer:
      "Yes, reputable platforms are typically regulated to ensure transparency and security for traders.",
  },
  {
    question: "Can I trade with leverage?",
    answer:
      "Some platforms offer leverage, but it amplifies both profits and losses and should be used cautiously.",
  },
  {
    question: "How secure is it?",
    answer:
      "Platforms employ encryption, authentication, and regulatory oversight to secure user data and funds.",
  },
];

const FrequentlyAskedQuestions = () => {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section className="bg-[rgb(25,31,46)] py-[150px]">
      <div className="w-full max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[2.5rem] font-bold text-white">
          <span className="text-[hsl(49,92%,54%)]">Frequently</span> Asked
          Questions
        </h2>
        <p className="font-normal mt-5 text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          Answers to your burning questions, frequently asked questions (faq) -
          find the solutions to common queries and concerns
        </p>

        <div className="w-full grid grid-cols-2 gap-10 mt-20 ">
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
                <span className="text-white text-3xl">
                  {active === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {active === index && (
                <p className="text-[rgba(255,255,255,0.7)]">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
