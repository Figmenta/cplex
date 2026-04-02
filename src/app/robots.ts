import type { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/constant/variabls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
        ],
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/preview/"],
      },
    ],
    sitemap: [`${WEBSITE_URL}/sitemap.xml`],
  };
}
