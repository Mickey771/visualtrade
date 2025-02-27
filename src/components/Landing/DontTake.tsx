import React from "react";

const reviews = [
  {
    image: "shane",
    name: "Shane Smith",
    username: "curtis",
    text: "This platform has made commodities trading a breeze",
  },
  {
    image: "david",
    name: "David Woe",
    username: "curtis",
    text: "THis platform's simplicity and real-time updates are a game changer",
  },
  {
    image: "alixha",
    name: "Alixha Hales",
    username: "curtis",
    text:
      "Trading made easy! This platform is a must try for commodities enthusiasts",
  },
];

const DontTake = () => {
  return (
    <section className="py-[100px] bg-[hsl(222,65%,8%)] ">
      <div className="w-full max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[2.5rem] font-bold text-white">
          Don't take our words
        </h2>
        <p className="font-normal mt-5 text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          From beginners to experts, True stories showing success in commodity
          trading - listen to our successful commodity traders
        </p>

        <div className="flex justify-center mt-20 gap-10">
          {reviews.map((item) => (
            <div className="w-[400px] bg-[rgb(25,31,46)] py-10 px-5 rounded-[6px] text-white flex flex-col items-center">
              <img
                src={`/${item.image}.png`}
                alt={item.name}
                className="rounded-full"
              />
              <h3 className="mt-4 text-[1.125rem] font-bold">{item.name}</h3>
              <p className="mt-1 text-[rgba(255,255,255,0.6)]">
                @{item.username}
              </p>
              <p className="mt-6 text-center">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DontTake;
