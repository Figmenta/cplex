import { client } from "./client";
import { type QueryParams } from "next-sanity";

type FetchSanityOptions = {
  /**
   * Cache tags for on-demand revalidation (`revalidateTag` from `/api/revalidate`).
   * Production: entries are cached until a tag is revalidated (no time-based expiry).
   * Defaults to `["content"]` when omitted so webhook invalidation always applies.
   */
  tags?: string[];
};

const DEFAULT_TAG = "content";

export const fetchSanityData = async <T>(
  query: string,
  params: QueryParams = {},
  options: FetchSanityOptions = {}
): Promise<T> => {
  const tagList =
    options.tags && options.tags.length > 0 ? options.tags : [DEFAULT_TAG];

  // Development: always fresh from Sanity. Production: Data Cache until webhook revalidates tag.
  if (process.env.NODE_ENV === "development") {
    return client.fetch(query, params, { cache: "no-store" });
  }

  return client.fetch(query, params, {
    cache: "force-cache",
    next: {
      // No ISR interval — only `revalidateTag` (e.g. Sanity webhook → /api/revalidate) refreshes data
      revalidate: false,
      tags: tagList,
    },
  });
};
