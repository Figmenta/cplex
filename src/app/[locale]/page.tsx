import { Metadata } from "next";
import { LOCALES } from "@/lib/i18n/constants";
import HomePage from "@/components/home/home-page";
import { WEBSITE_URL } from "@/constant/variabls";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params; // locale reserved for future Sanity / i18n content

  return (
    <>
      <HomePage />
    </>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogImage = `${WEBSITE_URL}/logo.png`;

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
    title: {
      default: "CPLEX | Law Firm",
      template: "%s | CPLEX",
    },
    description:
      "CPLEX is a law firm delivering strategic legal counsel and representation across civil, corporate, and regulatory matters—with clarity, rigor, and discretion.",
    authors: [{ name: "CPLEX" }],
    creator: "CPLEX",
    publisher: "CPLEX",
    openGraph: {
      title: "CPLEX | Law Firm",
      description:
        "Strategic legal counsel for businesses and individuals. Explore CPLEX for experienced representation and clear guidance.",
      url: WEBSITE_URL,
      siteName: "CPLEX",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "CPLEX law firm",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CPLEX | Law Firm",
      description:
        "Strategic legal counsel and representation from CPLEX—clarity and rigor when it matters most.",
      images: [ogImage],
    },
  };

  const itMetadata = {
    ...commonMetadata,
    title: {
      default: "CPLEX | Studio Legale",
      template: "%s | CPLEX",
    },
    description:
      "CPLEX è uno studio legale che offre consulenza strategica e assistenza in materia civile, societaria e regolamentare—con chiarezza, rigore e riservatezza.",
    authors: [{ name: "CPLEX" }],
    creator: "CPLEX",
    publisher: "CPLEX",
    openGraph: {
      title: "CPLEX | Studio Legale",
      description:
        "Consulenza legale strategica per imprese e privati. Scopri CPLEX per assistenza qualificata e orientamento chiaro.",
      url: WEBSITE_URL,
      siteName: "CPLEX",
      locale: "it_IT",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Studio legale CPLEX",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CPLEX | Studio Legale",
      description:
        "Consulenza e assistenza legale da CPLEX—chiarezza e rigore quando conta davvero.",
      images: [ogImage],
    },
  };

  return locale === "en"
    ? enMetadata
    : locale === "it"
      ? itMetadata
      : enMetadata;
}
