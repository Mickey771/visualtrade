import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaX } from "react-icons/fa6";
import { RiTwitterXFill } from "react-icons/ri";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import Image from "next/image";
import { IconType } from "react-icons";

interface FooterItem {
  heading: string;
  items: {
    text: string;
    icon?: IconType;
    path?: string;
    phone?: boolean;
  }[];
}

const footerData: FooterItem[] = [
  {
    heading: "Quick Links",
    items: [
      {
        text: "Home",
      },
    ],
  },
  {
    heading: "Policy Pages",
    items: [
      {
        text: "Privacy Policy",
        path: "privacy-policy",
      },
      {
        text: "Terms of Service",
        path: "terms-of-service",
      },
    ],
  },

  {
    heading: "Contact Us",
    items: [
      {
        text: "support@quantempowerai.com",
        icon: CiLocationOn,
      },
      {
        text: "Regulated by ASIC - ",
        icon: CiLocationOn,
        phone: true,
      },
      {
        text: "68 Northbourne Ave, Canberra ACT 2601, Australia",
        icon: CiLocationOn,
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

            <p className="md:w-[400.36px] mt-[28px] mb-6  text-[rgba(255,255,255,0.7)] text-[15px] text-left font-normal font-['DM Sans'] leading-[30px]">
              The company's net income increased consistently throughout 2024,
              with the most recent document indicating a $279 million annual
              increase.
            </p>
          </div>
          <div className="text-left md:w-[60%] grid grid-cols-1 md:flex gap-y-[46px] gap-x-0  md:gap-[59px] ">
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
                  <div className="w-full flex  flex-col gap-[12px] mb:gap-[18px]">
                    {footerItem.items.map((item, index) => {
                      let Icon = item.icon;

                      if (item.phone) {
                        return (
                          <p className="w-full lg:max-w-[250px] border-b  border-[rgba(255,255,255,0.1)] pb-4 flex flex-wrap items-start gap-[6px] text-wrap md:max-w-[257px]  text-[rgba(255,255,255,0.7)] text-[15px] font-normal font-dm_sans leading-tight">
                            <span>{item.text}</span>{" "}
                            <a
                              className="text-blue-500 "
                              target="_blank"
                              href="https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchTab=search&searchText=Empower+AI+&searchType=OrgAndBusNm"
                            >
                              681 424 144
                            </a>
                          </p>
                        );
                      }

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
            ©{new Date().getFullYear()}{" "}
            <span className="text-[hsl(49,92%,54%)]">Quant Empower AI.</span>{" "}
            All Rights Reserved.
          </p>
        </section>
      </article>
    </footer>
  );
};

export default Footer;
