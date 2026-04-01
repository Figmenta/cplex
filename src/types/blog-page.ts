import { CaseStudyContentBlock, VideoObject } from "./interface";

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage: {
    asset: {
      url: string;
    };
  };
  description: CaseStudyContentBlock[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  author: {
    _id: string;
    name: string;
    avatar?: {
      asset: {
        url: string;
      };
    };
    role?: string;
  };
  _createdAt: string;
  _updatedAt: string;
  content:CaseStudyContentBlock[];
  relatedPosts?: IBlogPost[];
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  ogImage?: {
    asset: {
      url: string;
    };
  };
  postDate?: string;
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface BlogPageData {
  featuredPosts: IBlogPost[];
  categories: BlogCategory[];
  siteMapVideos?: VideoObject[];
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  ogImage: {
    asset: {
      url: string;
    };
  };
  postDate?: string;
}
