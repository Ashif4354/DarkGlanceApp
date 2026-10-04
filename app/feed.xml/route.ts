import { site } from "@/data/site";
import { SEO_CONFIG, SITE_URL } from "@/lib/seo";

export async function GET() {
  const itemsXml = site.projects
    .map((project) => {
      const link =
        project.links.live || project.links.github || `${SITE_URL}/#work`;
      const description = `<![CDATA[${project.description} Tech stack: ${project.tech.join(", ")}.]]>`;

      return `    <item>
      <title><![CDATA[${project.name} — ${project.oneLiner}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">${SITE_URL}/#project-${project.id}</guid>
      <description>${description}</description>
      <category><![CDATA[${project.categories.join(", ")}]]></category>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SEO_CONFIG.title}]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${SEO_CONFIG.description}]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
