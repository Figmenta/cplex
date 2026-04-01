import { StudioBrandingSolution } from "./branding-solutions";
import { FAQ } from "./faq";
import { TileImageInterface } from "./interface";

export interface StudioBrandingPage {
    name: string;
    title: string;
    tileImages: TileImageInterface[];
    secondSectiontext: string;
    solutions: StudioBrandingSolution[];
    faq: FAQ;
  }
  