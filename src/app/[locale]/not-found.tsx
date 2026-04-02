import NotFoundContent from "@/components/not-found/not-found-content";
import { WEBSITE_URL } from "@/constant/variabls";
import { Metadata } from "next";

export default function NotFound() {
  return (
    <>
      <NotFoundContent />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = `${WEBSITE_URL}/logo.svg`;
  return {
    metadataBase: new URL(WEBSITE_URL),
    title: "Page not found | CPLEX",
    description:
      "This page could not be found. Return to CPLEX to continue browsing our law firm site.",
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "Page not found | CPLEX",
      description:
        "The page you requested is not available. Use the site navigation to find what you need.",
      url: WEBSITE_URL,
      siteName: "CPLEX",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "CPLEX",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Page not found | CPLEX",
      description:
        "This page could not be found. Visit CPLEX for legal counsel and firm information.",
      images: [ogImage],
    },
  };
}
