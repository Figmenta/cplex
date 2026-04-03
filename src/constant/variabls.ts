import { cn } from "@/lib/utils";
import { FIRM_TABS } from "@/components/home/content";

export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const sectionTitle =
  "font-montserrat text-lg font-bold uppercase tracking-[0.35em] text-section-heading md:text-[26px]";

/** All bottom subnav rows: same height token + horizontal padding */
export const SUBNAV_MIN_STYLE = {
  minHeight: "var(--home-subnav-height)",
} as const;

export const subnavRowClass =
  "flex w-full shrink-0 items-center gap-2 px-6 md:px-10";

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

/**
 * Normalized timeline progress for each firm stage (stage 5→6 has a gap; total ~1.2s in s-units).
 */
export const FIRM_INTERNAL_STOPS = [
  0, 0.1, 0.2, 0.35, 0.55833, 0.725, 1,
] as const;
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
  {
    slug: "Daniele-Peppe",
    name: "Daniele Peppe",
    role: "Co-founder",
    image: "/team/team-3.png",
  },
  {
    slug: "Michelangelo Capua",
    name: "Michelangelo Capua",
    role: "Co-founder",
    image: "/team/team-2.png",
  },
  {
    slug: "Maria",
    name: "Maria Elena",
  role: "",
    image: "/team/team-4.png",
  },
  {
    slug: "Bucci",
    name: "Bucci",
    role: "Co-founder",
    image: "/team/team-5.png",
  },
  {
    slug: "Paolo-Torsello",
    name: "Paolo Torsello",
    role: "",
    image: "/team/team-6.png",
  },
  {
    slug: "Davide-Pagani",
    name: "Davide Pagani",
    role: "",
    image: "/team/team-7.png",
  },
  {
    slug: "Ludovica-Bartolini",
    name: "Ludovica Bartolini",
    role: "",
    image: "/team/team-8.png",
  },
  {
    slug: "Giuseppe",
    name: "Giuseppe",
    role: "",
    image: "/team/team-7.png",
  },
  {
    slug: "Andrea-Malagoli",
    name: "Andrea Malagoli",
    role: "",
    image: "/team/team-10.png",
  },
] as const;

export const PROFESSIONALS_DETAILS: Record<
  (typeof PROFESSIONALS_ITEMS)[number]["slug"],
  {
    name: string;
    image: string;
    role: string;
    bioFormat: "prose" | "structured";
    proseBio?: string;
    qualifica?: string;
    istruzione?: string[];
    lingue?: string[];
    email?: string;
  }
> = {
  "Daniele-Peppe": {
    name: "Daniele Peppe",
    image: "/team/team-3.png",
    role: "Co-founder",
    bioFormat: "prose",
    proseBio:
      "Avv. Daniele Peppe specializes in criminal law and economic criminal law. He has developed extensive experience in both advisory and litigation assistance for individuals as well as companies.\n\nIn the field of judicial assistance — including several high-profile cases — he has developed particular expertise in criminal law relating to public administration and economic criminal law, including corporate offences, bankruptcy crimes, tax offences, urban planning and environmental crimes under Legislative Decree No. 152/2006 (Environmental Code), as well as offences concerning excise duties and petroleum products under Legislative Decree No. 504/1995 (Excise Duties Code).\n\nHe has participated in the defence in numerous proceedings involving allegations of corporate crimes, bankruptcy offences, and tax crimes, including cases involving liability under Legislative Decree No. 231/2001.",
  },
  "Michelangelo Capua": {
    name: "Michelangelo Capua",
    image: "/team/team-2.png",
    role: "Co-founder",
    bioFormat: "prose",
    proseBio:
      "Avv. Michelangelo Capua is a co-founder of CP | LEX with extensive experience in corporate law, commercial transactions, and regulatory compliance.\n\nHis practice encompasses mergers and acquisitions, joint ventures, corporate governance, and commercial contracts. He regularly advises Italian and international clients on complex cross-border transactions.",
  },
  "Maria": {
    name: "Maria Elena",
    image: "/team/team-4.png",
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
  "Bucci": {
    name: "Bucci",
    image: "/team/team-5.png",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "bucci@cplex.it",
  },
  "Paolo-Torsello": {
    name: "Paolo Torsello",
    image: "/team/team-6.png",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "torsello@cplex.it",
  },
  "Davide-Pagani": {
    name: "Davide Pagani",
    image: "/team/team-7.png",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "pagani@cplex.it",
  },
  "Ludovica-Bartolini": {
    name: "Ludovica Bartolini",
    image: "/team/team-8.png",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "bartolini@cplex.it",
  },
  "Giuseppe": {
    name: "Giuseppe",
    image: "/team/team-7.png",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "giuseppe@cplex.it",
  },
  "Andrea-Malagoli": {
    name: "Andrea Malagoli",
    image: "/team/team-10.png",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "malagoli@cplex.it",
  },
};
