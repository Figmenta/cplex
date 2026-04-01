// Generate a slug from any text, supporting Unicode (e.g., Chinese), and ensure stable dashes
function generateSlugFromText(text: string): string {
  const trimmed = (text || "").trim();
  if (!trimmed) return "section";
  // Normalize and strip diacritics where possible
  const normalized = trimmed.normalize("NFKD").replace(/\p{Diacritic}+/gu, "");
  // Keep letters/numbers from any script plus spaces and dashes
  const safe = normalized.replace(/[^\p{Letter}\p{Number}\s-]/gu, "");
  const collapsed = safe.replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  // If still empty (e.g., only punctuation), fall back
  return collapsed || "section";
}

export const extractH2Headings = (content: any) => {
  const headings: { id: string; text: string; level: number }[] = [];
  const idCounts: Record<string, number> = {};

  const processBlock = (block: any) => {
    if (block.style === "h2" && block.children) {
      const text = block.children.map((child: any) => child.text).join("");
      const baseId = generateSlugFromText(text).toLowerCase();
      const keySuffix = typeof block._key === "string" ? `-${block._key.slice(0, 6)}` : "";
      const id = `${baseId}${keySuffix}`;
      headings.push({ id, text, level: 2 });
    }

    if (block.children) {
      block.children.forEach(processBlock);
    }
  };

  content.forEach(processBlock);
  return headings;
};
