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

export type MenuOption = {
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
    imageURL?: string;
    optionCategories: OptionCategory[];
  }


export interface Shop {
    address: string | null;
    category: string | null;
    contactInfo: ContactInfo;
    description: string | null;
    image: string | null;
    location: string | null;
    menu: MenuItem[];
    name: string | null;
    openingHours: OpeningHours;
}

export interface CustomerProps {
    id: string;
    name: string;
    address: string;
  }
  
  export interface StoreProps {
    id: string;
    name: string;
    address: string;
    category?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
    };
    description?: string | null;
    image?: string;
    location?: string;
    menu?: MenuItem[];
    openingHours?: {
      [key: string]: {
        open?: string;
        close?: string;
      };
    };
  }
  
  interface MenuItem {
    id: string;
    name: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    price?: number;
  }
  
  export interface ItemProps {
    id?: string;
    name: string;
    description: string;
    image?: File | undefined;
    imageAlt?: string;
    price: number;
    inStock?: boolean;
    newImage?: File | undefined;
    imageURL?: string;
  }
  
  export type OrderStatusType =
    | "pending"
    | "in-progress"
    | "complete"
    | "cancelled"
    | "refunded"
    | "failed";
  
  export interface OrderProps {
    id: string;
    item: ItemProps;
    store: StoreProps;
    quantity: number;
    customer: CustomerProps;
    date: Date;
    status: OrderStatusType;
  }
  