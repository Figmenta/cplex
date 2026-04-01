import { CaseStudy } from "./interface";

export interface StudioBrandingSolution {
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  media: MediaItem[];
  stickyBarText: string;
  deliverables: {
    title: string;
    media: MediaItem[];
  }[];
  caseStudies: CaseStudy[];
  content: {
    en: (BlockContent | TextImageBlock | ImageCarouselBlock | ImageBlock | FileBlock | VideoFileBlock | any)[] ;
    it: (BlockContent | TextImageBlock | ImageCarouselBlock | ImageBlock | FileBlock | VideoFileBlock | any)[] ;
  };
}

export type MediaItem = {
  _type: "image" | "video" | "gif" | "file";
  _key: string;
  asset: SanityImageAsset | SanityFileAsset;
};

export interface SanityImageAsset {
  _ref: string;
  _type: "reference";
  url?: string;
}

export interface  SanityFileAsset {
  _ref: string;
  _type: "reference";
  url?: string;
}

export type BlockContent = {
  _type: "block";
  style?: string;
  children: {
    text: string;
    _type: "span";
  }[];
};

export type TextImageBlock = {
  _type: "textImageBlock";
  // Add detailed shape if known
};

export type ImageCarouselBlock = {
  _type: "imageCarouselBlock";
  // Add detailed shape if known
};

export type ImageBlock = {
  _type: "image";
  asset: SanityImageAsset;
};

export type FileBlock = {
  _type: "fileBlock";
  file: SanityFileAsset;
  height?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

export type VideoFileBlock = {
  _type: "videoFileBlock";
  file: SanityFileAsset;
  height?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
};