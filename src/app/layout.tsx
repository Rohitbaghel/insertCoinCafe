import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Geist, Geist_Mono, Teko } from "next/font/google";
import { RootProviders } from "@/components/root-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const barlow = Barlow_Semi_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InsertCoinCafe",
  description:
    "Gaming cafe booking for players and operator tools for InsertCoinCafe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${teko.variable} ${barlow.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
