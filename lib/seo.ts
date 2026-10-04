import { site } from "@/data/site";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://darkglance.in";

export const SEO_CONFIG = {
  title: "DarkGlance — FullStack Developer & Software Craftsman",
  titleTemplate: "%s | DarkGlance",
  description:
    "Portfolio of Ashif (DarkGlance) — FullStack Developer & Software Craftsman based in Chennai, India. Specializing in Python, FastAPI, Next.js, React, Playwright automation bots, and high-performance web systems.",
  author: site.identity.name,
  handle: site.identity.handle,
  email: site.identity.email,
  location: site.identity.location,
  logo: site.identity.logo,
  avatar: site.identity.avatar,
  tagline: site.identity.tagline,
  keywords: [
    "DarkGlance",
    "Ashif",
    "Ashif4354",
    "FullStack Developer",
    "Software Craftsman",
    "Python Developer",
    "FastAPI",
    "Next.js Developer",
    "React",
    "TypeScript",
    "Playwright Automation",
    "StreamStorm",
    "TicketRadar",
    "DGUpdater",
    "CyclicTasks",
    "PageVision",
    "DGBuzzer",
    "TacToeTic",
    "Chennai Developer",
    "Software Engineer India",
    "Open Source Developer",
    "Automation Engineer",
    "Desktop Automation",
    "Async Systems",
    "FastMCP",
    "PydanticAI",
  ],
};

export function generateStructuredData() {
  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const webpageId = `${SITE_URL}/#webpage`;

  const sameAsLinks = [
    ...Object.values(site.identity.links),
    "https://pypi.org/project/dgupdater/",
  ];

  const softwareProjects = site.projects.map((project, idx) => {
    const cats = project.categories as readonly string[];
    const isMobile = cats.includes("Mobile");
    const isGame = project.name.toLowerCase().includes("tic");
    const isDevTool = cats.includes("Tools") || cats.includes("Open Source");

    let appCategory = "UtilitiesApplication";
    if (isMobile) appCategory = "MobileApplication";
    else if (isGame) appCategory = "GameApplication";
    else if (isDevTool) appCategory = "DeveloperApplication";

    return {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#project-${project.id}`,
      position: idx + 1,
      name: project.name,
      headline: project.oneLiner,
      description: project.description,
      applicationCategory: appCategory,
      operatingSystem: isMobile
        ? "Android"
        : "Windows, Linux, macOS, Web",
      url: project.links.live || project.links.github || `${SITE_URL}/#work`,
      image: project.logo || `${SITE_URL}/assets/DG.png`,
      author: {
        "@type": "Person",
        "@id": personId,
        name: site.identity.name,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      keywords: project.tech.join(", "),
      license: project.license
        ? `https://spdx.org/licenses/${project.license}.html`
        : "https://opensource.org/licenses/MIT",
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: "DarkGlance",
        alternateName: ["DarkGlance Portfolio", "Ashif Portfolio"],
        description: SEO_CONFIG.description,
        inLanguage: "en-US",
        publisher: {
          "@type": "Person",
          "@id": personId,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": webpageId,
        url: SITE_URL,
        name: SEO_CONFIG.title,
        isPartOf: {
          "@type": "WebSite",
          "@id": websiteId,
        },
        about: {
          "@type": "Person",
          "@id": personId,
        },
        mainEntity: {
          "@type": "Person",
          "@id": personId,
        },
        inLanguage: "en-US",
        description: SEO_CONFIG.description,
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.identity.name,
        alternateName: [site.identity.handle, "Ashif4354"],
        url: SITE_URL,
        image: site.identity.avatar,
        jobTitle: site.identity.title,
        description: `${site.identity.tagline} ${site.identity.bio}`,
        email: `mailto:${site.identity.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Chennai",
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        },
        worksFor: {
          "@type": "Organization",
          name: "Independent",
        },
        sameAs: sameAsLinks,
        knowsAbout: [
          ...site.skills.strong,
          ...site.skills.other,
          "FullStack Development",
          "Software Engineering",
          "Reverse Engineering",
          "Distributed Architecture",
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: "Featured Software Applications & Projects by DarkGlance",
        description:
          "Open source projects, automation bots, and web applications created by Ashif.",
        numberOfItems: softwareProjects.length,
        itemListElement: softwareProjects,
      },
    ],
  };
}
