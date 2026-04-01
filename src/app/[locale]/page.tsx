import { Metadata } from "next";
import { LOCALES } from "@/lib/i18n/constants";
import { HomePageData } from "../../types/interface";
import { getHomePageData } from "@/lib/i18n/getSanityContent";
import PageReveal from "@/components/ui/page-reveal";
import { WEBSITE_URL } from "@/constant/variabls";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const HomePageData: HomePageData = await getHomePageData(locale);

  return (
    <>
      <PageReveal />
    </>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const commonMetadata = {
    formatDetection: {
      telephone: false,
      date: false,
      email: false,
      address: false,
    },
    metadataBase: new URL(WEBSITE_URL),
    alternates: {
      canonical: `${WEBSITE_URL}/${locale}`,
      languages: {
        "x-default": `${WEBSITE_URL}/en`,
        en: `${WEBSITE_URL}/en`,
        it: `${WEBSITE_URL}/it`,
      },
    },
    robots: {
      follow: true,
      index: true,
      nocache: true,
      googleBot:
        "index, follow, nocache, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    manifest: "/site.webmanifest",
  };

  const enMetadata = {
    ...commonMetadata,
    title: "Figmenta Studio: Where we design brands and digital properties",
    description:
      "Figmenta Studio helps you craft powerful brands and digital solutions that drive business success. Let's create something amazing together.",
    authors: [{ name: "Figmenta Studio" }],
    creator: "Figmenta Studio",
    publisher: "Figmenta Studio",
    openGraph: {
      title: "Figmenta Studio | Creative & Digital Design Solutions",
      description:
        "Discover Figmenta Studio – your partner for creative branding, digital solutions, and innovative storytelling.",
      url: WEBSITE_URL,
      siteName: "Figmenta Studio",
      locale: "en",
      type: "website",
      images: [
        {
          url: "https://studio.figmenta.com/logo.webp",
          width: 1200,
          height: 630,
          alt: "Figmenta Studio Branding Services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Figmenta Studio | Creative & Digital Experts",
      description:
        "Transform your brand with Figmenta Studio's innovative design and digital services.",
      creator: "@figmenta",
      images: ["https://studio.figmenta.com/logo.webp"],
    },
  };

  const itMetadata = {
    ...commonMetadata,
    title:
      "Figmenta Studio: Dove progettiamo e realizziamo brand, siti web e digital properties",
    description:
      "Figmenta Studio ti aiuta a creare brand potenti e soluzioni digitali che favoriscono il successo aziendale. Creiamo qualcosa di straordinario insieme.",
    authors: [{ name: "Figmenta Studio" }],
    creator: "Figmenta Studio",
    publisher: "Figmenta Studio",
    openGraph: {
      title: "Figmenta Studio | Soluzioni di Design Creativo e Digitale",
      description:
        "Scopri Figmenta Studio – il tuo partner per il branding creativo, soluzioni digitali e storytelling innovativo.",
      url: WEBSITE_URL,
      siteName: "Figmenta Studio",
      locale: "it",
      type: "website",
      images: [
        {
          url: "https://studio.figmenta.com/logo.webp",
          width: 1200,
          height: 630,
          alt: "Servizi di Branding Figmenta Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Figmenta Studio | Esperti in Creatività e Soluzioni Digitali",
      description:
        "Trasforma il tuo brand con i servizi innovativi di design e digitali di Figmenta Studio.",
      creator: "@figmenta",
      images: ["https://studio.figmenta.com/logo.webp"],
    },
  };

  return locale === "en"
    ? enMetadata
    : locale === "it"
      ? itMetadata
      : enMetadata;
}
