export const getAllLocales = () => `
  *[_type == "locale"]
`;

// Home Page
export const getHomePageQuery = (locale: string) => `
  *[_type == "figmentaStudioHomePage"][0] {
    "text": text.${locale},
    caseStudies[]->{
      "name": name.${locale},
      "slug": slug.current,
      clientName,
      location,
      featuredImage {
        asset->{ url }
      },
      logo {
        asset->{ url }
      },
      categories[]->{
        name,
        image {
          asset->{ url }
        }
      },
    }
  }
`;
