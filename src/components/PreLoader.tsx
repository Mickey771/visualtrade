import React from "react";

const PreLoader = () => {
  return (
    <div className="flex items-center justify-center h-lvh w-full">
      <div className="w-[160px] h-[160px] border-t-4 border-b-4 border-primaryBlue rounded-full animate-spin"></div>
    </div>
  );
};

export default PreLoader;
