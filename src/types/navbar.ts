export interface Navbar {
  _id: string;
  _type: "navbar";
  website: "Figmenta" | "Studio" | "Live" | "Productions";
  navItems: NavItem[];
}

export interface NavItem {
  _key: string;
  title: string;
  isSubMenu?: boolean;
  slug?: string;
  icon?: {
    asset: {
      url: string;
    };
  };
  subMenuItems?: SubMenuItem[];
}

export interface SubMenuItem {
  _key: string;
  title: string;
  subItemSlug?: string;
  nestedMenuItems?: NestedMenuItem[];
}

export interface NestedMenuItem {
  _key: string;
  title: string;
  icon?: {
    asset: {
      url: string;
    };
  };
  slug: string;
}

// Type for navbar query results
export interface NavbarQueryResult {
  website: "Figmenta" | "Studio" | "Live" | "Productions";
  navItems: NavItem[];
}
