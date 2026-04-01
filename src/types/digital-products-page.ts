import { StudioDigitalProductsSolution } from "./digital-products-solution";
import { FAQ } from "./faq";
import { TileImageInterface } from "./interface";

export interface StudioDigitalProductsPage {
    name: string;
    title: string;
    // logos: {
    //     asset: {
    //         url: string;
    //     }
    // }[];
    tileImages: TileImageInterface[];
    secondSectiontext: string;
    solutions: StudioDigitalProductsSolution[];
    faq: FAQ;
  }
