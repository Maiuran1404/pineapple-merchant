import { nanoid } from "nanoid";
import burgerImage from "~/images/products/burger.avif";
import friesImage from "~/images/products/fries.avif";

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

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  price?: number;
}

export interface ItemProps {
  id?: string | number;
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