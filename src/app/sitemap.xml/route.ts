import { NextResponse } from "next/server";
import { LOCALES } from "@/lib/i18n/constants";
import { WEBSITE_URL } from "@/constant/variabls";

export async function GET() {
  const pages = [];

  // Helper function to generate hreflang links for a base path
  const generateHreflangLinks = (basePath: string): string => {
    const links =
      LOCALES.map(
        (locale) =>
          `    <xhtml:link rel="alternate" hreflang="${locale}" href="${WEBSITE_URL}/${locale}${basePath}"/>`
      ).join("\n") +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${WEBSITE_URL}/en${basePath}"/>`;

    return links;
  };

  // Static top-level pages
  for (const locale of LOCALES) {
    pages.push({
      url: `${WEBSITE_URL}/${locale}`,
      lastModified: new Date().toISOString(),
      priority: 1.0,
      changefreq: "daily",
      hreflang: generateHreflangLinks(""),
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map((page) => {
    const hreflangSection = page.hreflang ? `\n${page.hreflang}` : "";
    return `<url>
  <loc>${page.url}</loc>${hreflangSection}
  <lastmod>${new Date(page.lastModified).toISOString()}</lastmod>
  <priority>${page.priority}</priority>
  <changefreq>${page.changefreq}</changefreq>
</url>`;
  })
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
