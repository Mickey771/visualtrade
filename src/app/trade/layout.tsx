"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row h-lvh border-t-2 border-[#040b11]">
        <Sidebar />
        <div className="w-full"> {children}</div>
      </div>
    </>
  );
}
