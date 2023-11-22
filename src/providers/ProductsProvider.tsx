import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useCallback, useState } from "react";
import { addStoreItem, getStoreItems, removeStoreItem } from "~/apiEndoints";
import type { ItemProps } from "~/constants/orders";
import { sampleProducts } from "~/constants/sampleProducts";
import useStore from "~/hooks/useStore";

interface ProductsContextType {
  isLoading: boolean;
  error: unknown;
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
  // Access the client
  const { store } = useStore();
  const queryClient = useQueryClient();
  const [productss, setProducts] = useState<ItemProps[]>(sampleProducts);

  const {
    isLoading,
    error,
    data: products,
  } = useQuery({
    queryKey: ["products", store?.id],
    queryFn: () => getStoreItems(store.id),
    enabled: !!store?.id,
  });

  const addProduct = useCallback(
    async (product: ItemProps) => {
      try {
        await addStoreItem(store?.id, product);
      } catch (err) {
        console.error(err);
      } finally {
        queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

  const removeProduct = useCallback(
    async (product: ItemProps) => {
      try {
        await removeStoreItem(store?.id, product.id);
      } catch (err) {
        console.error(err);
      } finally {
        queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

  function updateProduct(updatedProduct: ItemProps) {
    const productIndex = productss.findIndex((p) => p.id === updatedProduct.id);
    const newProducts = [...productss];

    newProducts[productIndex] = updatedProduct;
    setProducts(newProducts);
  }

  const value = {
    isLoading,
    error,
    products,
    addProduct,
    removeProduct,
    updateProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;
