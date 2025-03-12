import Footer from "@/components/Footer";
import LandingNavbar from "@/components/Landing/LandingNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full overflow-hidden">
      <LandingNavbar />
      {children}
      <Footer />
    </div>
  );
}
