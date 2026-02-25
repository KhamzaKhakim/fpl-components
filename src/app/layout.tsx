import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";

import Header from "../components/Header";
import Providers from "../context/Providers";
import { UserProvider } from "../context/user/UserProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FPL app",
  description: "FPL app with useful tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${geistSans.variable} ${geistMono.variable} antialiased text-black!`}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
