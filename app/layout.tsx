import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Cinzel } from "next/font/google";
import { site } from "@/data/site";
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
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: "DarkGlance — FullStack Developer",
  description:
    "I build tools nobody asked for, then everybody needs. Projects, experiments, and open-source work by Ashif.",
  openGraph: {
    title: "DarkGlance — FullStack Developer",
    description: "Independent builder from Chennai, India.",
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? {
          url: process.env.NEXT_PUBLIC_SITE_URL,
          images: [
            {
              url: new URL(
                "/opengraph-image",
                process.env.NEXT_PUBLIC_SITE_URL,
              ).toString(),
            },
          ],
        }
      : {}),
    siteName: "DarkGlance",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DarkGlance — FullStack Developer",
    description: "I build tools nobody asked for, then everybody needs.",
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? {
          images: [
            new URL(
              "/opengraph-image",
              process.env.NEXT_PUBLIC_SITE_URL,
            ).toString(),
          ],
        }
      : {}),
  },
  icons: {
    icon: site.identity.logo,
    shortcut: site.identity.logo,
    apple: site.identity.logo,
  },
};
export const viewport: Viewport = {
  themeColor: "#050202",
  colorScheme: "dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.identity.name,
    alternateName: site.identity.handle,
    image: site.identity.logo,
    jobTitle: site.identity.title,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
    url: "https://darkglance.in",
    sameAs: Object.values(site.identity.links),
  };
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <html
      lang="en"
      className={`${display.variable} ${geist.variable} ${mono.variable} ${cinzel.variable}`}
    >
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
        <EggProvider>{children}</EggProvider>
      </body>
    </html>
  );
}
