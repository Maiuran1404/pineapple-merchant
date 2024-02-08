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
    queryKey: ["products", store?.id],
    queryFn: () => getStoreItems(store?.id),
    enabled: !!store?.id,
  });

  const addProduct = useCallback(
    async (product: ItemProps) => {
      try {
        const resp = await addStoreItem(store.id, product);

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
        const resp = await updateStoreItem(store.id, updatedProduct);
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
