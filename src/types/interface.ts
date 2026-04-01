// Video Object Interface
export interface VideoObject {
  video?: {
    asset?: {
      url: string;
    };
  };
  videoUrl?: string;
  title?: string;
  description?: string;
  thumbnail?: {
    asset?: {
      url: string;
    };
  };
  duration?: number;
  uploadDate?: string;
}

// Interface for Home Page
export interface HomePageData {
  text: string;
  caseStudies: CaseStudy[];
}

export interface CaseStudy {
  name: string;
  slug: string;
  clientName: string;
  location: string;
  featuredImage: {
    asset: {
      url: string;
    };
  };
  logo: {
    asset: {
      url: string;
    };
  };
  categories: Array<{
    name: string;
    image: {
      asset: {
        url: string;
      };
    };
  }>;
  content: CaseStudyContentBlock[];
}

export type CaseStudyContentBlock =
  | SanityBlock // default block content (text, headings, etc.)
  | TextImageBlock
  | ImageBlock
  | ImageCarouselBlock;

export interface SanityBlock {
  _type: "block";
  style?: string;
  children: Array<{
    _type: "span";
    text: string;
    marks?: string[];
  }>;
  markDefs?: any[];
  [key: string]: any;
}

export interface TextImageBlock {
  _type: "textImageBlock";
  layout: string;
  aspectRatio: number;
  text: string;
  image: {
    asset: {
      url: string;
    };
  };
}

export interface ImageBlock {
  _type: "image";
  asset: {
    url: string;
  };
}

export interface ImageCarouselBlock {
  _type: "imageCarouselBlock";
  media: Array<
    | {
      _type: "image";
      asset: {
        url: string;
      };
    }
    | {
      _type: "file";
      asset: {
        url: string;
      };
    }
    | {
      _type: "carouselMediaItem";
      file?: {
        asset?: {
          url?: string;
        };
      };
      videoTitle?: string;
      videoDescription?: string;
      videoThumbnail?: {
        asset?: {
          url?: string;
        };
      };
      videoDuration?: number;
      videoUploadDate?: string;
      videoUrl?: string;
    }
  >;
}



// Interface for Divisions Content
export interface DivisionsContent {
  url: string;
  image: any;
  enDescription: string;
  itDescription: string;
}

// Interface for Contact Page
export interface LocationType {
  locationName: string;
  email: string;
  image: {
    asset: {
      _id: string;
      url: string;
    }
  };
}

export interface FaqItemType {
  question: {
    en: string;
    it: string;
  };
  answer: {
    en: string;
    it: string;
  };
}

export interface LogoType {
  image: {
    asset: {
      _id: string;
      url: string;
    }
  };
  alt: string;
}

export interface ContactDataType {
  title: string;
  heading: {
    en: string;
    it: string;
  };
  locations: LocationType[];
  faq: {
    title: string;
    faqs: FaqItemType[];
  };
  logos: LogoType[];
}

// Interface for Case Studies
export interface CaseStudyType {
  name: string;
  slug: string;
  featuredImage: string;
  logo: string;
  country?: string;
  category?: {
    title: string;
    categories: {
      name: string;
      image: string;
    }[];
  };
  content: any;
}



export interface TileImageInterface {
  asset: {
    url: string;
  }
}
