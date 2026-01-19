import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golden Key Fortune 2026",
  description: "AI春节营销H5：懂财报的运势签",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
