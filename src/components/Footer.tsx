import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaX } from "react-icons/fa6";
import { RiTwitterXFill } from "react-icons/ri";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import Image from "next/image";

const footerData = [
  {
    heading: "Quick Links",
    items: [
      {
        text: "Home",
        path: "",
        icon: false,
      },
    ],
  },
  {
    heading: "Policy Pages",
    items: [
      {
        text: "Privacy Policy",
        path: "privacy-policy",
        icon: false,
      },
      {
        text: "Terms of Service",
        path: "terms-of-service",
        icon: false,
      },
    ],
  },

  {
    heading: "Contact us",
    items: [
      {
        text: "support@visertrade.com",
        icon: CiLocationOn,
        path: "",
      },
      {
        text: "+44 20 1234 5678",
        icon: CiLocationOn,
        path: "",
      },
      {
        text: "68 Northbourne Ave, Canberra ACT 2601, Australia",
        icon: CiLocationOn,
        path: "",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="px-7 md:px-0 pt-[47px]  bg-[rgb(25,31,46)] ">
      <article className="flex flex-col">
        <section className="max-w-max pb-[15px] w-full border-b-[1px]  border-[rgba(255,255,255,0.1)] mx-auto text-center sm:flex justify-between">
          <div className="flex flex-col mb-12">
            {/* <span><Logocolored />logo</span> */}
            <Link href={"/"} className="text-4xl  text-left font-bold">
              <div className="w-full max-w-[200px] md:max-w-[250px]">
                <Image
                  src={"/logo.png"}
                  alt="logo"
                  className="w-full object-contain"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </Link>

            <p className="w-[400.36px] mt-[28px] mb-6  text-[rgba(255,255,255,0.7)] text-[15px] text-left font-normal font-['DM Sans'] leading-[30px]">
              The company had consecutive increases in its net income throughout
              the entirety of 2024, from last record showing an increase of 156%
              per year.
            </p>
            <div className="flex gap-[12px] text-[20px] text-primaryPurple items-center">
              <a
                href="https://x.com/vapzersignals?s=21"
                target="_blank"
                className="p-2 rounded-full bg-white text-black"
              >
                <RiTwitterXFill />
              </a>
              <a
                href="https://www.instagram.com/vapzer.ai?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
                target="_blank"
                className="p-2 rounded-full bg-white text-black"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/vapzer.ai?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
                target="_blank"
                className="p-2 rounded-full bg-white text-black"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/vapzer.ai?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
                target="_blank"
                className="p-2 rounded-full bg-white text-black"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
          <div className="text-left w-[60%] grid grid-cols-1 md:flex gap-y-[46px] gap-x-0  md:gap-[59px] ">
            {footerData.map((footerItem, index) => {
              return (
                <div
                  key={index}
                  className={`flex w-full h-fit flex-col gap-5 mb:gap-6 ${
                    index === 1 &&
                    "md:border-x border-[rgba(255,255,255,0.1)] md:px-[50px]"
                  }`}
                >
                  <h2 className="text-white w-full text-lg font-bold font-dm_sans leading-snug border-b  border-[rgba(255,255,255,0.1)] pb-4">
                    {footerItem.heading}
                  </h2>
                  <div className="w-full flex flex-col gap-[12px] mb:gap-[18px]">
                    {footerItem.items.map((item, index) => {
                      let Icon = item.icon;
                      if (item.icon) {
                        return (
                          <p
                            className="w-full lg:max-w-[250px] border-b  border-[rgba(255,255,255,0.1)] pb-4 flex  items-start gap-[6px] text-wrap md:max-w-[257px]  text-[rgba(255,255,255,0.7)] text-[15px] font-normal font-dm_sans leading-tight"
                            key={index}
                          >
                            {item.text}
                          </p>
                        );
                      }
                      return (
                        <Link
                          className="w-full lg:max-w-[250px] border-b  border-[rgba(255,255,255,0.1)] pb-4   font-normal font-dm_sans leading-tight text-[rgba(255,255,255,0.7)] text-[15px]"
                          key={index}
                          href={`/${item.path}`}
                        >
                          {item.text}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="max-w-max py-[25px] mx-auto w-full flex flex-col sm:flex-row justify-center">
          <p className="text-left sm:text-right text-[rgba(255,255,255,0.7)] text-[15px]">
            ©2025 <span className="text-[hsl(49,92%,54%)]">ViserTrade.</span>{" "}
            All Right Reserved.
          </p>
        </section>
      </article>
    </footer>
  );
};

export default Footer;
