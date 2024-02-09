import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";
import { getStore } from "~/apiEndpoints";

interface StoreProps {
  id(
    id: any,
    setOrders: React.Dispatch<
      React.SetStateAction<import("../constants/orders").OrderProps[]>
    >,
  ): unknown;
  uid: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  imageUrl: string;
  cardColour: string;
  emoji: string;
  freePoints: number;
}

interface StoreContextType {
  isLoading: boolean;
  error: unknown;
  store: StoreProps | undefined;

  updateInfo: (info: StoreProps) => void;
}

// Define the context
export const StoreContext = createContext<StoreContextType | null>(null);

function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [shop, setShop] = useState<any>(null);
  const [shopId, setShopId] = useState<string>();

  useEffect(() => {
    if (user?.publicMetadata?.shopId) {
      const { shopId } = user.publicMetadata;
      setShopId(shopId);
    }
  }, [user]);

  const {
    isLoading,
    error,
    data: store,
  } = useQuery({
    queryKey: ["store", shopId],
    queryFn: () => getStore(shopId),
    enabled: !!shopId,
  });

  function updateInfo(info: StoreProps) {
    console.log(info);
  }

  const value = { isLoading, error, store, updateInfo };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export default StoreProvider;
