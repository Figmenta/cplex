import { CaseStudy } from "./interface";

export interface StudioDigitalProductsSolution {
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  media: {
    image: { asset: { url: string } };
    video: { asset: { url: string } };
    videoOptions: { autoplay: boolean, loop: boolean, muted: boolean };
  };
  stickyBarText: string;
  deliverables: {
    title: string;
    media: MediaItem[];
  }[];
  caseStudies: CaseStudy[];
  content: {
    en: (BlockContent | TextImageBlock | ImageCarouselBlock | ImageBlock)[];
    it: (BlockContent | TextImageBlock | ImageCarouselBlock | ImageBlock)[];
  };
}

export type MediaItem = {
  _type: "image";
  _key: string;
  asset: {
    url: string;
  };
};

export interface SanityImageAsset {
  _ref: string;
  _type: "reference";
}

export interface SanityFileAsset {
  _ref: string;
  _type: "reference";
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