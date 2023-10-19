import React, { createContext, useState } from "react";

interface StoreStatusContextType {
  closed: boolean;
  toggleOpen: () => void;
}

// Define the context
export const StoreStatusContext = createContext<
  StoreStatusContextType | undefined
>(undefined);

function StoreStatusProvider({ children }: { children: React.ReactNode }) {
  const [closed, setClosed] = useState(false);

  function toggleOpen() {
    setClosed(!closed);
  }

  const value = { closed, toggleOpen };

  return (
    <StoreStatusContext.Provider value={value}>
      {children}
    </StoreStatusContext.Provider>
  );
}

export default StoreStatusProvider;
