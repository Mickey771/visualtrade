import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoExpandOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="bg-primaryBlue text-white">
      <div className="flex gap-6 py-2">
        <div className="w-[320px] p-4 text-xl md:text-2xl lg:text-3xl border-r-2 border-[#040b11]">
          <img src="/logo.png" alt="logo" />
        </div>

        <div className="zr:hidden sm:flex flex gap-5 md:gap:10 lg:gap-14 items-center  justify-end lg:justify-center w-full py-3 border-r-2 border-[#040b11]">
          <div className="flex gap-5 md:gap:10 lg:gap-10">
            <div>
              <p className="text-sm md:text-base lg:text-base">BALANCE</p>
              <p className="text-sm md:text-base lg:text-base">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">EQUITY</p>
              <p className="text-sm md:text-base lg:text-base">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">MARGIN</p>
              <p className="text-sm md:text-base lg:text-base">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">FREE BALANCE</p>
              <p className="text-sm md:text-base lg:text-base">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">OPEN P&L</p>
              <p className="text-sm md:text-base lg:text-base">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">CLOSE P&L</p>
              <p className="text-sm md:text-base lg:text-base">$0</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center pr-6 lg:pr-0">
          <span className="text-[20px] md:text-[25px] lg:text-[30px]">
            <FaWallet />
          </span>
          <div className="">
            <p className="text-sm md:text-base lg:text-base">CREDIT</p>
            <p className="text-sm md:text-base lg:text-base"> $1523</p>
          </div>

          <button className="bg-[#18a0fb] text-sm md:text-base px-4 md:px-8 py-1 rounded-lg h-fit">
            DEPOSIT
          </button>
        </div>

        <div className="zr:hidden xl:flex gap-5 items-center pl-4 border-l-2 border-[#040b11]">
          <span>
            <MdOutlinePersonOutline size={30} />
          </span>
          <span>
            <IoMdNotificationsOutline size={30} />
          </span>
          <span>
            <IoSettingsOutline size={30} />
          </span>
          <span>
            <IoExpandOutline size={30} />
          </span>
          <span>
            <BsThreeDotsVertical size={30} />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
