import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoExpandOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="bg-primaryBlue text-white">
      <div className="flex gap-6 py-2">
        <h1 className="w-[300px] p-4 text-3xl border-r-2 border-[#040b11]">
          ViserTrade
        </h1>

        <div className="flex gap-14 py-3">
          <div>
            <p className="text-lg">BALANCE</p>
            <p className="text-lg">$0</p>
          </div>
          <div>
            <p className="text-lg">EQUITY</p>
            <p className="text-lg">$0</p>
          </div>
          <div>
            <p className="text-lg">MARGIN</p>
            <p className="text-lg">$0</p>
          </div>
          <div>
            <p className="text-lg">FREE BALANCE</p>
            <p className="text-lg">$0</p>
          </div>
          <div>
            <p className="text-lg">OPEN P&L</p>
            <p className="text-lg">$0</p>
          </div>

          <button className="bg-[#18a0fb] px-8 py-1 rounded-lg">DEPOSIT</button>
        </div>

        <div className="flex gap-5 items-center pl-4 border-l-2 border-[#040b11]">
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
