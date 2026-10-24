import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "./components/site/analytics-tracker";
import { SmoothScroll } from "./components/site/smooth-scroll";
import { getPublicProfile } from "./features/content/repository";

const space = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-space",
  display: "swap",
});
const mono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getPublicProfile();
  const title = profile.seo?.title || `${profile.name} | ${profile.title.en}`;
  const description = profile.seo?.description || profile.intro.en;
  return {
    title: { default: title, template: `%s | ${profile.name}` },
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    openGraph: { type: "website", siteName: profile.name, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body className={`${space.variable} ${mono.variable}`}>
        <SmoothScroll />
        <AnalyticsTracker />
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
