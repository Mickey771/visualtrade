import ProviderWrapper from "@/components/ProviderWrapper";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <div className="w-full">
          <ProviderWrapper>{children}</ProviderWrapper>
        </div>
      </body>
    </html>
  );
}
