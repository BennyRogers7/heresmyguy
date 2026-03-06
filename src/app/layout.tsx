import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://heresmyguy.com"),
  title: {
    default: "Here's My Guy | Find Trusted Local Contractors",
    template: "%s | Here's My Guy",
  },
  description:
    "Find the contractor your neighbor swears by. Browse 2,000+ landscapers, roofers, electricians, and more across the US. Read reviews, compare ratings, and hire with confidence.",
  keywords: [
    "contractors near me",
    "local contractors",
    "landscapers",
    "roofers",
    "electricians",
    "find a contractor",
    "trusted contractors",
  ],
  openGraph: {
    title: "Here's My Guy | Find Trusted Local Contractors",
    description:
      "Find the contractor your neighbor swears by. Browse local pros, read reviews, and hire with confidence.",
    type: "website",
    locale: "en_US",
    siteName: "Here's My Guy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Here's My Guy | Find Trusted Local Contractors",
    description:
      "Find the contractor your neighbor swears by. Browse local pros, read reviews, and hire with confidence.",
  },
  alternates: {
    canonical: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Here's My Guy",
  url: "https://heresmyguy.com",
  logo: "https://heresmyguy.com/mascot.png",
  description:
    "Find the contractor your neighbor swears by. Browse trusted local contractors across the US.",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Here's My Guy",
  url: "https://heresmyguy.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://heresmyguy.com/{state}/{city}/{vertical}",
    "query-input": "required name=vertical",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8f7f4]`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
