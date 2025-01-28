"use client";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Navbar />
        <div className="flex flex-col lg:flex-row h-lvh border-t-2 border-[#040b11]">
          <Sidebar />
          <div> {children}</div>
        </div>
      </body>
    </html>
  );
}
