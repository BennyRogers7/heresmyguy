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
  metadataBase: new URL("https://mnplumb.com"),
  title: {
    default: "MN Plumbers Directory | Find Licensed Plumbers in Minnesota",
    template: "%s | MN Plumbers Directory",
  },
  description:
    "Find trusted, licensed plumbers in Minnesota. Browse 628+ plumbers across 62 cities. Read reviews, compare ratings, and get quotes from local plumbing professionals.",
  keywords: [
    "Minnesota plumbers",
    "MN plumbers",
    "plumbers near me",
    "licensed plumbers Minnesota",
    "plumbing services MN",
  ],
  openGraph: {
    title: "MN Plumbers Directory | Find Licensed Plumbers in Minnesota",
    description:
      "Find trusted, licensed plumbers in Minnesota. Browse 628+ plumbers across 62 cities.",
    type: "website",
    locale: "en_US",
    siteName: "MN Plumbers Directory",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MN Plumbers Directory - Find Licensed Plumbers in Minnesota",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MN Plumbers Directory | Find Licensed Plumbers in Minnesota",
    description:
      "Find trusted, licensed plumbers in Minnesota. Browse 628+ plumbers across 62 cities.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MN Plumbers Directory",
  url: "https://mnplumb.com",
  logo: "https://mnplumb.com/og-image.png",
  description:
    "Find trusted, licensed plumbers in Minnesota. Browse 628+ plumbers across 62 cities.",
  areaServed: {
    "@type": "State",
    name: "Minnesota",
    addressCountry: "US",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MN Plumbers Directory",
  url: "https://mnplumb.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://mnplumb.com/{city}",
    "query-input": "required name=city",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
