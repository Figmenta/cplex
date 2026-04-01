/**
 * Normalizes a slug by handling special characters and URL encoding
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Decode URL encoding
  let normalized = decodeURIComponent(slug);
  
  // Handle common special characters that might cause issues
  normalized = normalized
    .toLowerCase()
    .trim()
    // Replace common accented characters with their base forms
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ß]/g, 'ss')
    // Remove any remaining special characters except hyphens
    .replace(/[^a-z0-9\-]/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
    
  return normalized;
}

/**
 * Creates multiple variations of a slug for matching
 */
export function createSlugVariations(slug: string): string[] {
  const variations = new Set<string>();
  
  // Add original slug
  variations.add(slug);
  
  // Add normalized version
  variations.add(normalizeSlug(slug));
  
  // Add URL encoded version
  variations.add(encodeURIComponent(slug));
  
  // Add URL decoded version
  variations.add(decodeURIComponent(slug));
  
  // Add lowercase version
  variations.add(slug.toLowerCase());
  
  // Add uppercase version
  variations.add(slug.toUpperCase());
  
  return Array.from(variations).filter(Boolean);
}
