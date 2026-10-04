import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Cinzel } from "next/font/google";
import { site } from "@/data/site";
import { SEO_CONFIG, SITE_URL, generateStructuredData } from "@/lib/seo";
import { EggProvider } from "@/components/eggs/EggProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import "./effects.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_CONFIG.title,
    template: SEO_CONFIG.titleTemplate,
  },
  description: SEO_CONFIG.description,
  applicationName: "DarkGlance",
  authors: [
    {
      name: `${site.identity.name} (${site.identity.handle})`,
      url: SITE_URL,
    },
  ],
  generator: "Next.js",
  keywords: SEO_CONFIG.keywords,
  creator: site.identity.name,
  publisher: site.identity.handle,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    url: SITE_URL,
    siteName: "DarkGlance",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.title,
    description: site.identity.tagline,
    creator: "@ig_darkglance",
    site: "@ig_darkglance",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: site.identity.logo, type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: site.identity.logo }],
  },
  category: "technology",
  classification: "Software Engineering & Developer Portfolio",
  other: {
    "google-adsense-account": "ca-pub-6347040738150367",
    author: `${site.identity.name} (${site.identity.handle})`,
    subject: "Software Engineering & Open Source Projects",
    rating: "General",
  },
};

export const viewport: Viewport = {
  themeColor: "#050202",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = generateStructuredData();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="en"
      className={`${display.variable} ${geist.variable} ${mono.variable} ${cinzel.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.darkglance.in" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.darkglance.in" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="DarkGlance Projects RSS Feed"
          href="/feed.xml"
        />
      </head>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <EggProvider>{children}</EggProvider>
      </body>
    </html>
  );
}
