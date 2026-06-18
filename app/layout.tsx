import type { Metadata } from "next";
import { IBM_Plex_Sans, Sora } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/site";
import { RouteTransition } from "@/components/route-transition";
import { GoogleAnalytics } from "@/components/google-analytics";
import { site, social } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: social.title, template: "%s | Dimaso" },
  description: social.description,
  alternates:{canonical:"https://dimaso.co/"},
  openGraph:{
    title:social.title,
    description:social.description,
    url:"https://dimaso.co/",
    type:"website",
    siteName:site.name,
    images:[{url:social.image,secureUrl:social.image,type:"image/png",width:1200,height:630,alt:social.imageAlt}],
  },
  twitter:{
    card:"summary_large_image",
    title:social.title,
    description:social.description,
    images:[{url:social.image,alt:social.imageAlt}],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${inter.variable} ${sora.variable}`}><Header /><RouteTransition>{children}</RouteTransition><Footer /><GoogleAnalytics /><SpeedInsights /><Analytics /></body></html>;
}
