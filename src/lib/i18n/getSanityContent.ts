import { fetchSanityData } from "../sanity/fetch";
import { getAllLocales, getHomePageQuery } from "../sanity/queries";

export async function getAllLocalizedContent() {
  return fetchSanityData<{ en: string; it: string }>(
    getAllLocales(),
    {},
    {
      tags: ["content"],
    }
  );
}

// home page data
export async function getHomePageData(locale: string): Promise<any> {
  try {
    const data = await fetchSanityData<any>(
      getHomePageQuery(locale),
      {},
      { tags: ["content"] }
    );
    return data;
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return null;
  }
}
