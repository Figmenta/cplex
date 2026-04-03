/** Static home content — replace with Sanity later */

export type ExpertiseSlug =
  | "mergers-acquisitions"
  | "corporate-commercial"
  | "intellectual-property"
  | "litigation-dispute";

export const EXPERTISE_AREAS: {
  slug: ExpertiseSlug;
  label: string;
  /** Narrow layouts (e.g. mobile home strip) */
  labelShort?: string;
  icon: string;
}[] = [
  {
    slug: "mergers-acquisitions",
    label: "Mergers & Acquisitions",
    icon: "/icons/mergers.svg",
  },
  {
    slug: "corporate-commercial",
    label: "Corporate & Commercial Law",
    labelShort: "Corporate & Commercial",
    icon: "/icons/corporate.svg",
  },
  {
    slug: "intellectual-property",
    label: "Intellectual Property",
    icon: "/icons/intellectual.svg",
  },
  {
    slug: "litigation-dispute",
    label: "Litigation & Dispute Resolution",
    labelShort: "Litigation & Dispute",
    icon: "/icons/litigation.svg",
  },
];

export function expertiseSlugToIndex(slug: ExpertiseSlug): number {
  const i = EXPERTISE_AREAS.findIndex((a) => a.slug === slug);
  return i >= 0 ? i : 0;
}

export type NewsItem = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "orion-novagrid",
    date: "March 12, 2027",
    title:
      "Orion Capital completed a strategic minority investment in NovaGrid Technologies, a European developer of smart energy infrastructure. CP LEX advised the investor on the transaction and related corporate matters.",
    excerpt:
      "Orion Capital completed a strategic minority investment in NovaGrid Technologies, a European developer of smart energy infrastructure. CP LEX advised the investor on the transaction and related corporate matters.",
    body: `Orion Capital completed a strategic minority investment in NovaGrid Technologies, a European developer of smart energy infrastructure. CP LEX advised the investor on the transaction and related corporate matters, including due diligence, structuring, and negotiation of the investment agreements.

The transaction strengthens NovaGrid's capacity to deploy next-generation grid infrastructure across Europe. Our team coordinated closely with corporate counsel and regulatory advisors to deliver a seamless closing.`,
    imageSrc:
      "/images/user.png",
    imageAlt: "Solar panels in a rural landscape",
  },
  {
    id: "helios-atlas",
    date: "January 28, 2027",
    title:
      "Helios Group entered into a joint venture with Atlas Renewables to develop large-scale solar projects across Southern Europe.",
    excerpt:
      "Helios Group entered into a joint venture with Atlas Renewables to develop large-scale solar projects across Southern Europe.",
    body: `Helios Group entered into a joint venture with Atlas Renewables to develop large-scale solar projects across Southern Europe. CP LEX acted as lead counsel on the joint venture structure, governance, and financing arrangements.

The partnership targets utility-scale solar deployment in multiple jurisdictions, with CP LEX supporting regulatory alignment and cross-border coordination.`,
    imageSrc:
      "/images/user.png",
    imageAlt: "Solar energy project",
  },
  {
    id: "vantage-delizia",
    date: "November 21, 2026",
    title:
      "Vantage Foods acquired Delizia Organics, a premium organic food producer with operations in Italy and Germany. CP LEX assisted the buyer throughout the acquisition process.",
    excerpt:
      "Vantage Foods acquired Delizia Organics, a premium organic food producer with operations in Italy and Germany. CP LEX assisted the buyer throughout the acquisition process.",
    body: `Vantage Foods acquired Delizia Organics, a premium organic food producer with operations in Italy and Germany. CP LEX assisted the buyer throughout the acquisition process, including due diligence, purchase agreement negotiation, and post-closing integration planning.

The transaction reflects continued consolidation in the European organic food sector. Our team worked across corporate, employment, and regulatory workstreams.`,
    imageSrc:
      "/images/user.png",
    imageAlt: "Organic food production",
  },
  {
    id: "chimera-sphinx",
    date: "September 02, 2026",
    title: "CP | LEX advises Chimera Bio on takeover of Sphinx Life",
    excerpt: "CP | LEX advises Chimera Bio on takeover of Sphinx Life",
    body: `CPLEX advised Chimera Bio on its recommended takeover offer for Sphinx Life, including regulatory filings and shareholder communications.

Our multidisciplinary team supported transaction structuring, disclosure obligations, and coordination with financial advisors.`,
    imageSrc:
      "/images/user.png",
    imageAlt: "Business meeting",
  },
];

export const FIRM_TABS = [
  { id: "overview", label: "CP | LEX" },
  { id: "approach", label: "Our approach" },
  { id: "international", label: "International perspective" },
  { id: "challenges", label: "Complex challenges" },
] as const;

export const EXPERTISE_COPY: Record<
  ExpertiseSlug,
  { overview: string; services: string; approach: string }
> = {
  "mergers-acquisitions": {
    overview:
      "We advise clients on the full lifecycle of corporate transactions—from early strategy through signing and closing—bringing disciplined execution and commercial judgment to complex deals.",
    services:
      "We provide legal counsel on share and asset deals, mergers, reorganisations, and post-closing integration, with a focus on risk allocation and regulatory alignment.",
    approach:
      "Our approach combines legal depth with business understanding: we work in integrated teams alongside financial and technical advisors to deliver outcomes that hold up in practice.",
  },
  "corporate-commercial": {
    overview:
      "We support businesses with day-to-day corporate governance, commercial agreements, and strategic transactions across jurisdictions.",
    services:
      "Our services include commercial contracts, joint ventures, supply arrangements, and corporate housekeeping for listed and private companies.",
    approach:
      "We prioritise clarity and speed: drafting that is precise, advice that is actionable, and coordination across practice areas when matters intersect.",
  },
  "intellectual-property": {
    overview:
      "We help clients protect and enforce IP assets in competitive markets, from portfolio strategy to dispute resolution.",
    services:
      "We advise on licensing, technology transfer, R&D collaborations, and IP aspects of M&A and financing transactions.",
    approach:
      "We align legal strategy with product and commercial roadmaps so IP decisions support long-term growth.",
  },
  "litigation-dispute": {
    overview:
      "We represent clients in high-stakes disputes and regulatory proceedings, with a focus on proportionate strategy and decisive outcomes.",
    services:
      "Our services span civil, commercial, and administrative proceedings, including emergency relief and cross-border coordination.",
    approach:
      "We invest in early case assessment and scenario planning so clients can choose the right forum and posture from the outset.",
  },
};

/** Hero imagery — replace with client assets in /public/images/home/ when available */
export const IMAGE_THE_FIRM_BUILDING =
  "/images/thefirm.png";
export const IMAGE_OUR_PROFESSIONALS =
  "/images/professional.png";
export const IMAGE_EXPERTISE_HERO =
  "/images/expertise.png";
export const IMAGE_THE_FIRM_2 =
  "/images/thefirm-2.png";
export const USER_IMAGE =
  "/images/user.png";
