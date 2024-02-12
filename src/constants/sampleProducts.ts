import { nanoid } from "nanoid";
import type { ItemProps } from "~/types";

export const sampleProducts: ItemProps[] = [
  {
    id: nanoid(),
    name: "Nomad Tumbler",
    description: "Keep your beverages hot or cold all day.",
    price: 35.0,
    inStock: true,
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
  {
    id: nanoid(),
    name: "Basic Tee",
    description: "Look fresh in this cotton tee.",
    price: 32,
    inStock: true,
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  // More products...
];
