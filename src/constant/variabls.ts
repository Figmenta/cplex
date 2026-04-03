import { cn } from "@/lib/utils";
import { FIRM_TABS } from "@/components/home/content";

export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const sectionTitle =
  "font-montserrat text-lg font-bold uppercase tracking-[0.35em] text-section-heading md:text-[26px]";

/** All bottom subnav rows: same height token + horizontal padding */
export const SUBNAV_MIN_STYLE = { minHeight: "var(--home-subnav-height)" } as const;

export const subnavRowClass = "flex w-full shrink-0 items-center gap-2 px-6 md:px-10";

/** Shared metrics for pill-style subnav controls (weight added per control). */
export const subnavControlBaseClass =
  "inline-flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] uppercase tracking-wide transition-opacity hover:opacity-90 md:text-[11px]";

/** Back to home, News index, View team — semibold labels */
export const subnavPrimaryBtnClass = cn(
  subnavControlBaseClass,
  "font-semibold text-foreground"
);

/**
 * Firm progress strip: back + tab columns (grid); same label metrics as subnavPrimaryBtnClass.
 */
export const subnavFirmSegmentClass =
  "flex min-h-0 min-w-0 cursor-pointer items-center justify-center px-2 py-1.5 text-center text-[10px] uppercase leading-tight tracking-wide transition-colors transition-opacity hover:opacity-90 md:px-3 md:text-[11px]";

export const FIRM_INTERNAL_STOPS = [0, 0.12, 0.24, 0.42, 0.67, 0.87, 1] as const;
export const FIRM_EXTERNAL_PROGRESS = [
  1 / 6,
  2 / 6,
  3 / 6,
  4 / 6,
  4 / 6,
  5 / 6,
  1,
] as const;
export const STAGE_TO_TAB: (typeof FIRM_TABS)[number]["id"][] = [
  "overview",
  "overview",
  "approach",
  "international",
  "international",
  "challenges",
  "challenges",
];
export const TAB_TO_STAGE: Record<(typeof FIRM_TABS)[number]["id"], number> = {
  overview: 1,
  approach: 2,
  international: 4,
  challenges: 6,
};
export const CARDS_STAGE_INDEX = 5;
export const PROFESSIONALS_STOPS = [0, 1] as const;

export const PROFESSIONALS_ITEMS = [
  { slug: "daniele-peppe", name: "Daniele Peppe", role: "Co-founder" },
  {
    slug: "michelangelo-capua",
    name: "Michelangelo Capua",
    role: "Co-founder",
  },
  { slug: "maria-elena", name: "Maria Elena", role: "" },
  { slug: "bucci", name: "Bucci", role: "" },
  { slug: "paolo-torsello", name: "Paolo Torsello", role: "" },
  { slug: "davide-pagani", name: "Davide Pagani", role: "" },
  { slug: "ludovica-bartolini", name: "Ludovica Bartolini", role: "" },
  { slug: "giuseppe", name: "Giuseppe", role: "" },
  { slug: "andrea-malagoli", name: "Andrea Malagoli", role: "" },
] as const;

export const PROFESSIONALS_DETAILS: Record<
  (typeof PROFESSIONALS_ITEMS)[number]["slug"],
  {
    name: string;
    role: string;
    bioFormat: "prose" | "structured";
    proseBio?: string;
    qualifica?: string;
    istruzione?: string[];
    lingue?: string[];
    email?: string;
  }
> = {
  "daniele-peppe": {
    name: "Daniele Peppe",
    role: "Co-founder",
    bioFormat: "prose",
    proseBio:
      "Avv. Daniele Peppe specializes in criminal law and economic criminal law. He has developed extensive experience in both advisory and litigation assistance for individuals as well as companies.\n\nIn the field of judicial assistance — including several high-profile cases — he has developed particular expertise in criminal law relating to public administration and economic criminal law, including corporate offences, bankruptcy crimes, tax offences, urban planning and environmental crimes under Legislative Decree No. 152/2006 (Environmental Code), as well as offences concerning excise duties and petroleum products under Legislative Decree No. 504/1995 (Excise Duties Code).\n\nHe has participated in the defence in numerous proceedings involving allegations of corporate crimes, bankruptcy offences, and tax crimes, including cases involving liability under Legislative Decree No. 231/2001.",
  },
  "michelangelo-capua": {
    name: "Michelangelo Capua",
    role: "Co-founder",
    bioFormat: "prose",
    proseBio:
      "Avv. Michelangelo Capua is a co-founder of CP | LEX with extensive experience in corporate law, commercial transactions, and regulatory compliance.\n\nHis practice encompasses mergers and acquisitions, joint ventures, corporate governance, and commercial contracts. He regularly advises Italian and international clients on complex cross-border transactions.",
  },
  "maria-elena": {
    name: "Maria Elena",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    istruzione: [
      "Laurea cum laude presso l'Universita Luiss Guido Carli di Roma (2009)",
      "Albo degli Avvocati di Roma (2012)",
    ],
    lingue: ["Inglese", "Spagnolo"],
    email: "ginevraproia@previti.it",
  },
  bucci: {
    name: "Bucci",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "bucci@cplex.it",
  },
  "paolo-torsello": {
    name: "Paolo Torsello",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "torsello@cplex.it",
  },
  "davide-pagani": {
    name: "Davide Pagani",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "pagani@cplex.it",
  },
  "ludovica-bartolini": {
    name: "Ludovica Bartolini",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "bartolini@cplex.it",
  },
  giuseppe: {
    name: "Giuseppe",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "giuseppe@cplex.it",
  },
  "andrea-malagoli": {
    name: "Andrea Malagoli",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "malagoli@cplex.it",
  },
};
