import Image from "next/image";
import React from "react";

const navLinks = [
  {
    text: "Home",
    path: "/",
  },
  {
    text: "About",
    path: "/about",
  },
  {
    text: "Blog",
    path: "/blog",
  },
  {
    text: "Contact",
    path: "/contact",
  },
];

const LandingNavbar = () => {
  return (
    <nav className="lg:fixed w-full z-[999] top-0 left-0 backdrop-blur-[17.5px] bg-[rgb(25,31,46)] lg:bg-[rgba(7,14,32,0.02)] ">
      <div className="w-full max-w-max mx-auto py-5 flex px-6 lg:px-0 justify-between text-white">
        <div className="w-full max-w-[150px] md:max-w-[200px] lg:max-w-[250px]">
          <Image
            src={"/logo2.png"}
            alt="logo"
            className="w-full object-contain"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="flex gap-3">
          <button className="bg-[hsl(208,7%,46%)] text-sm md:text-base py-2 md:py-3 px-[20px] md:px-[30px] lg:px-[40px] hover:opacity-85 font-semibold rounded-[8px]">
            Login
          </button>
          <button className="bg-base text-black text-sm md:text-[16px] py-2 md:py-3 px-[20px] md:px-[30px] lg:px-[40px] hover:opacity-85 font-semibold rounded-[8px]">
            Signup
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
