import React from "react";

const Sidebar = () => {
  return (
    <div className="w-[400px] bg-primaryBlue h-full flex flex-col items-center py-3 px-5">
      <input
        type="text"
        className="w-full py-2 px-3 bg-secondaryBlue"
        placeholder="Search"
      />

      <div className="grid grid-cols-3 gap-4 mt-3 w-full px-2 justify-center">
        <h2 className="text-white text-sm font-light">INSTRU</h2>
        <h2 className="text-white text-sm font-light">SELL</h2>
        <h2 className="text-white text-sm font-light">BUY</h2>
      </div>

      {Array.from({ length: 10 }, () => (
        <div className="grid grid-cols-3 gap-4 mt-3 w-full px-2 justify-center">
          <p className="text-white text-lg"> EUR/USD</p>
          <p className="text-white text-sm font-light">
            1.02 <span className="text-lg">69</span>
          </p>
          <p className="text-white text-sm font-light">
            1.02 <span className="text-lg">71</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
