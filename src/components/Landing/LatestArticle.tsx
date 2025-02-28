import React from "react";

const articles = [
  {
    image: "globalisation",
    heading: "Globalization and Commodity Trading",
    text:
      "In an increasingly interconnected world, globalization has transformed the landscape of commodity trading, reshaping markets, su...",
  },
  {
    image: "future",
    heading: "The Future of Commodity Trading",
    text:
      "In an era of rapid technological advancement and global interconnectedness, the future of commodity trading holds both promise a...",
  },
  {
    image: "promoting",
    heading: "Promoting Sustainability in Commodity Markets",
    text:
      "In an era where environmental and social responsibility are paramount, promoting sustainability in commodity markets has become...",
  },
];

const LatestArticle = () => {
  return (
    <section className="py-[50px] md:py-[150px] lg:py-[150px] bg-[hsl(222,65%,8%)] ">
      <div className="w-full px-6 lg:px-0 max-w-max mx-auto flex flex-col items-center">
        <h2 className="text-center text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-white">
          <span className="text-[hsl(49,92%,54%)]">Latest</span> Article & Blog
        </h2>
        <p className="font-normal mt-5 text-sm md:text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          Explore insights and ideas, dive into our latest blog posts for expert
          tips, trend analysis, inspirational and motivational content
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((item) => (
            <div className="bg-[rgb(25,31,46)] rounded-[10px]">
              <img
                src={`/${item.image}.png`}
                alt={item.heading}
                className="rounded-t-[10px]"
              />
              <div className="pt-10 pb-6 flex flex-col gap-5  px-6">
                <h2 className="text-white text-[1.25rem] font-bold">
                  {item.heading}
                </h2>
                <p className="text-[rgba(255,255,255,0.7)] text-[15px]">
                  {item.text}
                </p>
                <button className="w-fit text-[hsl(49,92%,54%)]">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticle;
