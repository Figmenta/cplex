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
  const locale = "en"; // Default for metadata
  return {
    title: `404 - Page Not Found`,
    description: "The page you are looking for does not exist.",
    openGraph: {
      title: `404 - Page Not Found`,
      description: "The page you are looking for does not exist.",
      url: `${WEBSITE_URL}/${locale}/not-found`,
      siteName: "Figmenta",
      locale: locale,
      type: "website",
      images: [
        {
          url: `${WEBSITE_URL}/logo.webp`,
          width: 1200,
          height: 630,
          alt: "404 - Page Not Found",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `404 - Page Not Found`,
      description: "The page you are looking for does not exist.",
      creator: "@figmenta",
      images: [
        {
          url: `${WEBSITE_URL}/logo.webp`,
          width: 1200,
          height: 630,
          alt: "404 - Page Not Found",
        },
      ],
    },
  };
}
