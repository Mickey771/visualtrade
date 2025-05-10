import React, { useEffect, useState } from "react";

const reviews = [
  {
    image: "shane",
    name: "Shane Smith",
    username: "curtis",
    text:
      "Easy to use and perfect for beginners-learned quickly and gained confidence",
  },
  {
    image: "david",
    name: "David Woe",
    username: "curtis",
    text: "Fast execution and no lag - ideal for active trading",
  },
  {
    image: "alixha",
    name: "Alixha Hales",
    username: "curtis",
    text:
      "I am thoroughly impressed by the efficiency and ease of the withdrawal process, which was completed with exceptional promptness",
  },
  {
    image: "shane",
    name: "Ben Curtis",
    username: "curtis",
    text: "Transparent fees and steady returns, a very trustworthy platform",
  },
  {
    image: "david",
    name: "Shane Cooper",
    username: "curtis",
    text: "Great customer support - quick, clear, and helpful every time",
  },
  {
    image: "alixha",
    name: "Daniel Bones",
    username: "curtis",
    text: "Lots of tools and real-time data - helps me trade smarter",
  },
];

interface Review {
  image: string;
  name: string;
  username: string;
  text: string;
}

const DontTake = () => {
  const [modifiedReviews, setModifiedReviews] = useState<Review[]>(reviews);
  const [position, setPosition] = useState(0);
  const [currIndex, setCurrIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let newReviews = modifiedReviews;

      newReviews.push(newReviews[currIndex]);

      setModifiedReviews(newReviews);

      console.log(modifiedReviews);

      setPosition((prev) => prev + 450);
      setCurrIndex((prev) => prev + 1);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [position]);

  return (
    <section className="py-[50px] md:py-[100px] lg:py-[150px] bg-[hsl(222,65%,8%)]">
      <div className="w-full px-6 lg:px-0 max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-white">
          Don't take our words
        </h2>
        <p className="font-normal mt-5 text-sm md:text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          From beginners to experts, True stories showing success in trading -
          listen to our successful traders
        </p>

        <div className="w-full overflow-x-hidden ">
          <div
            style={{
              transform: `translateX(-${position}px)`,
              transition: "transform 1.2s ease-in-out", // Added smooth transition
            }}
            className="flex px-10 mt-20 gap-5 md:gap-10"
          >
            {modifiedReviews.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="min-w-[450px] w-full bg-[rgb(25,31,46)] py-10 px-5 rounded-[6px] text-white flex flex-col items-center"
              >
                <img
                  src={`/${item.image}.png`}
                  alt={item.name}
                  className="rounded-full"
                />
                <h3 className="mt-4 text-[1.125rem] font-bold">{item.name}</h3>
                {/* <p className="mt-1 text-[rgba(255,255,255,0.6)]">
                  @{item.username}
                </p> */}
                <p className="mt-6 text-center">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DontTake;
