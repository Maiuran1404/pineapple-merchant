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
  
type OpeningHours = Record<string, {
      open: string;
      close: string;
}>;
  
export interface Shop {
    address: string;
    contactInfo: ContactInfo;
    description: string;
    image: File | null; // Assuming image is a File object. Use 'any' if the type varies.
    location: string;
    menu: Menu;
    name: string;
    openingHours: OpeningHours;
    stripeConnectedId: string;
}
  