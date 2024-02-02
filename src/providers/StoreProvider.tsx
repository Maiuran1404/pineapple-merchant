import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect } from "react";
import { getStore } from "~/apiEndpoints";
import { useUser } from "./UserProvider";

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
  const [storeID, setStoreID] = React.useState<string | null>(null);

  // useEffect(() => {
  //   async function fetchStoreID(): Promise<void> {
  //     // const fireStoreUser = await getFirestoreUser(user);

  //     // const storeID = (fireStoreUser?.storeId as string) ?? null;
  //     setStoreID(storeID);
  //   }

  //   void fetchStoreID();
  // }, [user]);

  const {
    isLoading,
    error,
    data: store,
  } = useQuery({
    queryKey: ["store", storeID],
    queryFn: () => getStore(storeID),
    enabled: !!storeID,
  });

  function updateInfo(info: StoreProps) {
    console.log(info);
  }

  console.log(store);

  const value = { isLoading, error, store, updateInfo };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export default StoreProvider;
