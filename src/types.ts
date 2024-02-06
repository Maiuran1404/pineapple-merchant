export type TOrder = {
    id: string;
    status: string;
    buyerName: string;
    purchaseTime: { toDate: () => Date };
    products: {
      name: string;
      options?: Record<string, string>;
    }[];
}

interface ContactInfo {
    email: string | null;
    phone: string | null;
}
  
interface Option {
    description: string | null;
    name: string | null;
    price: number | null;
}
  
interface OptionType {
    name: string | null;
    options: Option[];
}
  
interface Menu {
    description: string | null;
    name: string | null;
    optionTypes: OptionType[];
}

interface Day {
    open: string | null;
    close: string | null;
};
  

type OpeningHours = {
    monday: Day;
    tuesday: Day;
    wednesday: Day;
    thursday: Day;
    friday: Day;
    saturday: Day;
    sunday: Day;
};

type MenuOption = {
    id: string;
    name: string;
    description: string;
    price: string;
  }
  
interface OptionCategory {
    name: string;
    description: string;
    options: MenuOption[];
  }
  
export interface MenuItem {
    name: string;
    price: string;
    description: string;
    imageUrl: string;
    optionCategories: OptionCategory[];
  }


export interface Shop {
    address: string | null;
    category: string | null;
    contactInfo: ContactInfo;
    description: string | null;
    image: string | null;
    location: string | null;
    menu: Menu;
    name: string | null;
    openingHours: OpeningHours;
}
  