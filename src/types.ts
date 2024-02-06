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
    email: string;
    phone: string;
}
  
interface Option {
    description: string;
    name: string;
    price: number;
}
  
interface OptionType {
    name: string;
    options: Option[];
}
  
interface Menu {
    description: string;
    name: string;
    optionTypes: OptionType[];
}

interface Day {
    open: string;
    close: string;
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


export interface Shop {
    address: string;
    category: string;
    contactInfo: ContactInfo;
    description: string;
    image: string;
    location: string;
    menu: Menu;
    name: string;
    openingHours: OpeningHours;
}
  