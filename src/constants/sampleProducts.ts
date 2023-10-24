import { nanoid } from "nanoid";
import type { ItemProps } from "./orders";

export const sampleProducts: ItemProps[] = [
  {
    id: nanoid(),
    name: "Nomad Tumbler",
    description: "Keep your beverages hot or cold all day.",
    price: 35.0,
    inStock: true,
    image:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
  {
    id: nanoid(),
    name: "Basic Tee",
    description: "Look fresh in this cotton tee.",
    price: 32,
    inStock: true,
    image:
      "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  // More products...
];
