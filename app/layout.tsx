import type { Metadata } from "next";
import { IBM_Plex_Sans, Sora } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/site";
import { RouteTransition } from "@/components/route-transition";
import { GoogleAnalytics } from "@/components/google-analytics";
import { site } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Dimaso | Senior web partner", template: "%s | Dimaso" },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${inter.variable} ${sora.variable}`}><Header /><RouteTransition>{children}</RouteTransition><Footer /><GoogleAnalytics /><SpeedInsights /><Analytics /></body></html>;
}
