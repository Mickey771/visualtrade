"use client";
import Footer from "@/components/Footer";
import LandingNavbar from "@/components/Landing/LandingNavbar";
import SocialLinks from "@/components/SocialLinks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SocialLinks />
    </>
  );
}
