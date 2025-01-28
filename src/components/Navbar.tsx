import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoExpandOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="bg-primaryBlue text-white">
      <div className="flex gap-6 py-2">
        <h1 className="w-[320px] p-4 text-xl md:text-2xl lg:text-3xl border-r-2 border-[#040b11]">
          Quant Empower AI
        </h1>

        <div className="flex gap-5 md:gap:10 lg:gap-14 items-center pr-6 lg:pr-0 justify-end lg:justify-center w-full py-3">
          <div className="zr:hidden sm:flex gap-5 md:gap:10 lg:gap-14">
            <div>
              <p className="text-sm md:text-base lg:text-lg">BALANCE</p>
              <p className="text-sm md:text-base lg:text-lg">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-lg">EQUITY</p>
              <p className="text-sm md:text-base lg:text-lg">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-lg">MARGIN</p>
              <p className="text-sm md:text-base lg:text-lg">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-lg">FREE BALANCE</p>
              <p className="text-sm md:text-base lg:text-lg">$0</p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-lg">OPEN P&L</p>
              <p className="text-sm md:text-base lg:text-lg">$0</p>
            </div>
          </div>

          <button className="bg-[#18a0fb] px-8 py-1 rounded-lg h-fit">
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
