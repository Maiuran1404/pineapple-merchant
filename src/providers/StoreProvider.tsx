import { useQuery } from "@tanstack/react-query";
import React, { createContext } from "react";
import { getStore } from "~/apiEndoints";
import { useUser } from "./UserProvider";

interface StoreProps {
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

  const {
    isLoading,
    error,
    data: store,
  } = useQuery({
    queryKey: ["store", user?.uid],
    queryFn: () => getStore(user),
    enabled: !!user,
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
