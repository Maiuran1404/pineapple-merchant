import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useCallback, useState } from "react";
import {
  addStoreItem,
  getStoreItems,
  removeStoreItem,
  updateStoreItem,
} from "~/apiEndpoints";
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
  const queryClient = useQueryClient();
  const { store } = useStore();

  const {
    isLoading,
    error,
    data: products,
  } = useQuery({
    queryKey: ["products", store?.id ?? ''], // Provide a fallback value to ensure it's always a string
    queryFn: () => getStoreItems(store?.id ?? ''), // Fallback value here as well
    enabled: !!store?.id,
  });

  const addProduct = useCallback(
    async (product: ItemProps) => {
      console.log("This is the add product", store?.id, product, product.name)
      try {
        console.log("trying to add yo");
        const resp = await addStoreItem(store.id, product);
        console.log("trying to add yo - sent to AddStoreItem");
        if (resp) {
          await queryClient.invalidateQueries({
            queryKey: ["products", store.id],
          });
        }

        return resp;
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        await queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

  const removeProduct = useCallback(
    async (product: ItemProps) => {
      try {
        await removeStoreItem(store.id, product.id).then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["products", store.id],
          });
        });
      } catch (err) {
        console.error(err);
      } finally {
        await queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

  const updateProduct = useCallback(
    async (updatedProduct: ItemProps) => {
      try {
        console.log("them details", store?.id, updatedProduct.id, updatedProduct);
        const resp = await updateStoreItem(store.id, updatedProduct.id, updatedProduct);
        if (resp) {
          await queryClient.invalidateQueries({
            queryKey: ["products", store.id],
          });
        }

        return resp;
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        await queryClient.invalidateQueries({
          queryKey: ["products", store.id],
        });
      }
    },
    [store, queryClient],
  );

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
