import { FAQItem } from "./faq";

export type LocationType = {
    locationName: string;
    email: string;
    image: {
      asset: {
        _id: string;
        url: string;
      };
    };
  };
  
  
  export type LogoType = {
    image: {
      asset: {
        _id: string;
        url: string;
      };
    };
    alt: string;
  };
  
  export type ContactDataType = {
    title: string;
    heading: string;
    locations: LocationType[];
    faq: {
      title: string;
      faqs: FAQItem[];
    };
    logos: LogoType[];
  };
  
  export interface ContactModelProps {
    isOpen: boolean;
    onClose: () => void;
    contactData: ContactDataType;
  }
  




  export type FaqItemType = {
    question: string;
    answer: string;
  };


  export interface ContactPageData {
    title: string;
    heading: string;
    locations: LocationType[];
    faq: {
      title: string;
      faqs: FaqItemType[];
    };
    logos: LogoType[];
  }
  
  