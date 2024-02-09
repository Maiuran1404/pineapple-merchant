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
}

export interface ItemProps {
  id: string;
  name: string;
  description: string;
  image?: File | undefined;
  imageAlt?: string;
  price: number;
  inStock?: boolean;
  newImage?: File | undefined;
  imageUrL?: string;
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

// export const orders: OrderProps[] = [
//   {
//     id: nanoid(),
//     item: {
//       id: nanoid(),
//       name: "Burger",
//       image: burgerImage,
//       description: "Tasty",
//       price: 5.99,
//     },
//     store: {
//       id: nanoid(),
//       name: "Burger King",
//       address: "123 Main St",
//     },
//     quantity: 1,
//     customer: {
//       id: nanoid(),
//       name: "John Doe",
//       address: "123 Main St",
//     },
//     date: new Date(),
//     status: "pending",
//   },
//   {
//     id: nanoid(),
//     item: {
//       id: nanoid(),
//       name: "Fries",
//       image: friesImage,
//       description: "Salty",
//       price: 2.99,
//     },
//     store: {
//       id: nanoid(),
//       name: "Burger King",
//       address: "123 Main St",
//     },
//     quantity: 1,
//     customer: {
//       id: nanoid(),
//       name: "John Doe",
//       address: "123 Main St",
//     },
//     date: new Date(),
//     status: "pending",
//   },
// ];
