"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { RootState } from "@/redux/reducers";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuth } = useSelector((store: RootState) => store.user);
  if (!isAuth) {
    return router.push("/login");
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
