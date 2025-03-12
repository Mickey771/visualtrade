import { RootState } from "@/redux/reducers";
import { logout } from "@/redux/reducers/userReducer";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoExpandOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [isLogout, setIsLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user } = useSelector((store: RootState) => store.user);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call the logout API route to clear the HTTP-only cookie
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important to include credentials for cookie operations
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Update Redux state regardless of API response
      dispatch(logout());

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear Redux state and redirect even if API call fails
      dispatch(logout());
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setIsLogout(false); // Close the logout dropdown
    }
  };

  return (
    <nav className="bg-primaryBlue text-white">
      <div className="flex gap-6 py-2">
        <div className="w-[320px] p-4 text-xl md:text-2xl lg:text-3xl border-r-2 border-[#040b11]">
          <img src="/logo.png" alt="logo" />
        </div>

        <div className="zr:hidden sm:flex flex gap-5 md:gap:10 lg:gap-14 items-center  justify-end lg:justify-center w-full py-3 border-r-2 border-[#040b11]">
          <div className="flex gap-5 md:gap:10 lg:gap-10">
            <div>
              <p className="text-sm md:text-base lg:text-base">CREDIT</p>
              <p className="text-sm md:text-base lg:text-base">
                ${user.credit}
              </p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">EQUITY</p>
              <p className="text-sm md:text-base lg:text-base">
                ${user.equity}
              </p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">MARGIN</p>
              <p className="text-sm md:text-base lg:text-base">
                ${user.margin}
              </p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">FREE MARGIN</p>
              <p className="text-sm md:text-base lg:text-base">
                ${user.free_margin}
              </p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">OPEN P&L</p>
              <p className="text-sm md:text-base lg:text-base">
                ${user.open_p_and_l}
              </p>
            </div>
            <div>
              <p className="text-sm md:text-base lg:text-base">CLOSE P&L</p>
              <p className="text-sm md:text-base lg:text-base">
                ${user.close_p_and_l}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center pr-6 lg:pr-0">
          <span className="text-[20px] md:text-[25px] lg:text-[30px]">
            <FaWallet />
          </span>
          <div className="">
            <p className="text-sm md:text-base lg:text-base">BALANCE</p>
            <p className="text-sm md:text-base lg:text-base">
              {" "}
              ${user.balance.toFixed(2)}
            </p>
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
          <div className="relative">
            <span onClick={() => setIsLogout((prev) => !prev)}>
              <BsThreeDotsVertical size={30} />
            </span>
            {isLogout && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="absolute top-[120%] right-0 z-[99] text-primaryBlue bg-white py-3 px-6 rounded-[6px] disabled:opacity-70"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
