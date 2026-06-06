import type { Metadata } from "next";
import { IBM_Plex_Sans, Sora } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/site";
import { site } from "@/lib/site";

const inter = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Dimaso | Senior web partner", template: "%s | Dimaso" },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${inter.variable} ${sora.variable}`}><Header />{children}<Footer /></body></html>;
}
