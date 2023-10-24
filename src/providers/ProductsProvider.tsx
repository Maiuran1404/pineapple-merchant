import React, { createContext, useState } from "react";
import type { ItemProps } from "~/constants/orders";
import { sampleProducts } from "~/constants/sampleProducts";

interface ProductsContextType {
  products: ItemProps[];
  addProduct: (product: ItemProps) => void;
  removeProduct: (product: ItemProps) => void;
  updateProduct: (updatedProduct: ItemProps) => void;
}

// Define the context
export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ItemProps[]>(sampleProducts);

  function addProduct(product: ItemProps) {
    setProducts([...products, product]);
  }

  function removeProduct(product: ItemProps) {
    setProducts(products.filter((p) => p.id !== product.id));
  }

  function updateProduct(updatedProduct: ItemProps) {
    const productIndex = products.findIndex((p) => p.id === updatedProduct.id);
    const newProducts = [...products];

    newProducts[productIndex] = updatedProduct;
    setProducts(newProducts);
  }

  const value = { products, addProduct, removeProduct, updateProduct };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;
